import json
import os
import glob

# path where SARIF files are located
sarif_folder_path = '../../back-end/semgrep-scan-results_extracted'

# output folder path for JSON files
output_folder_path = '../../back-end/vulnerabilities_json/'

# check if output folder exists. if not, create it
if not os.path.exists(output_folder_path):
    os.makedirs(output_folder_path)

# Find the most recent .sarif file in the folder
list_of_sarif_files = glob.glob(os.path.join(sarif_folder_path, '*.sarif'))
latest_sarif_file = max(list_of_sarif_files, key=os.path.getmtime)

# Load SARIF file
with open(latest_sarif_file, 'r') as file:
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

# output file = .sarif extension with .json
output_json_filename = os.path.basename(latest_sarif_file).replace('.sarif', '.json')

# Full path output JSON file in back-end/vulnerabilities_json folder
output_json = os.path.join(output_folder_path, output_json_filename)

# Save the extracted data to a JSON file
with open(output_json, 'w') as outfile:
    json.dump(vulnerabilities, outfile, indent=4)

print(f"Vulnerabilities extracted and saved to {output_json}")
