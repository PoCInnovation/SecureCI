import json

# Load the SARIF file
with open('../semgrep-results.sarif', 'r') as file:
    sarif_data = json.load(file)

# Extract relevant data
vulnerabilities = []
for run in sarif_data.get('runs', []):
    for result in run.get('results', []):
        for location in result.get('locations', []):
            physical_location = location.get('physicalLocation', {})
            message = result.get('message', {}).get('text', '')

            vulnerabilities.append({
                'physicallocation': physical_location,
                'message': message
            })

# Save the extracted data to a JSON file
output_json = '../vulnerabilities.json'
with open(output_json, 'w') as outfile:
    json.dump(vulnerabilities, outfile, indent=4)

print(f"Vulnerabilities extracted and saved to {output_json}")