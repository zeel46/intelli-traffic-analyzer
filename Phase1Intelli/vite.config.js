import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function syncApiKeyPlugin() {
  return {
    name: 'sync-api-key',
    configureServer(server) {
      server.watcher.add(path.resolve(__dirname, 'test-site.html'));
      server.watcher.on('change', (file) => {
        if (file.includes('test-site.html')) {
          try {
            const testSiteContent = fs.readFileSync(file, 'utf-8');
            const match = testSiteContent.match(/data-key="([^"]+)"/);
            if (match && match[1]) {
              const apiKey = match[1];
              const simulatorPath = path.resolve(__dirname, 'simulator.html');
              if (fs.existsSync(simulatorPath)) {
                let simulatorContent = fs.readFileSync(simulatorPath, 'utf-8');
                simulatorContent = simulatorContent.replace(/const API_KEY = "[^"]+";/, `const API_KEY = "${apiKey}";`);
                fs.writeFileSync(simulatorPath, simulatorContent);
                console.log(`\n[Vite Plugin] Automatically synced new API Key to simulator.html: ${apiKey}`);
              }
            }
          } catch (err) {
            console.error('[Vite Plugin] Error syncing API key:', err);
          }
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), syncApiKeyPlugin()],
})
