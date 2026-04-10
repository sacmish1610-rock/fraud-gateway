#!/bin/bash

echo "🚀 Loading enrichment data..."

cat <<EOL > externalData.json
{
  "blacklistedIPs": ["192.168.1.1", "10.0.0.5"],
  "highRiskCountries": ["Nigeria", "Pakistan"],
  "fraudDevices": ["DEVICE123", "DEVICE999"]
}
EOL

echo "✅ External data loaded successfully!"