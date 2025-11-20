#!/usr/bin/env zsh
# MCP wrapper to ensure nvm Node version is available

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the node version from .nvmrc if it exists, otherwise use current default
if [ -f "$(pwd)/.nvmrc" ]; then
    nvm use
fi

# Execute the actual MCP server with npm
exec npm run mcp
