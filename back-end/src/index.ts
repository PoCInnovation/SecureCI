import express, { Express, Request, Response, Application } from 'express';
import { appId, privateKeyPath, serverPort, webhookSecret, clientSecret, clientId } from './config.js';
import { App } from 'octokit';
import { createNodeMiddleware } from '@octokit/webhooks';
import { createWriteStream, readFileSync, rm } from 'fs';
import { createServer } from "node:http";
import { Readable } from "stream";
import AdmZip from "adm-zip";

const privateKey = readFileSync(privateKeyPath, 'utf8');

const app = new App({
    appId,
    privateKey,
    webhooks: {
        secret: webhookSecret
    },
    oauth: { clientId, clientSecret }
});


const getSemgrepScanResults = async ({ octokit, payload }) => {
    if (payload.workflow_run.name != 'Semgrep') {
        return;
    }
    try {
        const response = await octokit.request(
            'GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts', {
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            run_id: payload.workflow_run.id,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const artifact = response.data.artifacts[0];
        const downloadedArtifact = await octokit.request(
            'GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}', {
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            artifact_id: artifact.id,
            archive_format: 'zip',
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        const fileName = "semgrep-scan-results";
        const outputDirectory = `${fileName}_extracted`;
        rm(outputDirectory, { 
            recursive: true, 
          }, (error) => { 
            if (error) { 
              console.log(error); 
            } else { 
              console.log("Deleted old scan results");
            } 
          }); 
        const artifactZipFile = await fetch(downloadedArtifact.url);
        if (artifactZipFile.ok && artifactZipFile.body) {
            console.log("Writing to file:", fileName);
            let writer = createWriteStream(fileName);
            Readable.fromWeb(artifactZipFile.body).pipe(writer);
        }
        const zip = new AdmZip(fileName);
        zip.extractAllTo(outputDirectory);
        console.log(`Extracted to "${outputDirectory}" successfully`);
    } catch (error) {
        console.log(error)
    }
}

app.webhooks.on("workflow_run.completed", getSemgrepScanResults);

const path = '/api/webhook';
const localWebhookUrl = `http:://localhost:${serverPort}${path}`;

const middleware = createNodeMiddleware(app.webhooks, { path });
const server = createServer(middleware);

server.listen(serverPort, () => {
    console.log(`Server is listening for events at ${localWebhookUrl}`);
});