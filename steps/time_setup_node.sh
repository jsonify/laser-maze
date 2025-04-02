#!/bin/bash
start_time=$(date +%s)
name="Setup Node.js Action"

echo "Starting $name at $(date)"

uses actions/setup-node@v3 with node-version: 18 cache: 'pnpm'

end_time=$(date +%s)
duration=$((end_time - start_time))
echo "$name took $duration seconds"
echo "Finished $name at $(date)"