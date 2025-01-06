import * as vscode from 'vscode';
import { Server } from 'remote-adb/server';
import { setLogger as setRemoteAdbLogger } from 'remote-adb/logger';

import { logger } from './logger';

let server: Server|undefined = undefined;
let serverUri: vscode.Uri|undefined = undefined;

async function startServerAtPort(context: vscode.ExtensionContext, port: number): Promise<vscode.Uri> {
	server = new Server(
		{
			port: port,
			host: "127.0.0.1"
		},
		/* httpsOptions */ undefined,
		{
			staticClientPath: vscode.Uri.joinPath(context.extensionUri, "dist/web").fsPath,
		}
	);

	serverUri = vscode.Uri.parse(await server.start());
	return serverUri;
}

async function ensureServerListening(context: vscode.ExtensionContext) {
	if (!(server && server.isListening())) {
		let port: number = 44615;
		let remainingAttempts = 5;

		while (remainingAttempts > 0) {
			remainingAttempts--;

			try {
				await startServerAtPort(context, port);
				break;
			} catch (e: any) {
				if (e.code === "EADDRINUSE" && remainingAttempts > 0) {
					logger.info(`Port ${port} is already in use, trying another port...`);
					if (remainingAttempts === 1) {
						// Try random port on the last attempt
						port = 0;
					} else {
						port++;
					}
				} else {
					logger.error(`Failed to start server: ${e.message}`);
					throw e;
				}
			}
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	setRemoteAdbLogger(logger);

	context.subscriptions.push(vscode.commands.registerCommand('remote-adb.openExternal', async () => {
		await ensureServerListening(context);

		if (serverUri) {
			await vscode.env.openExternal(serverUri);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('remote-adb.getExternalUrl', async (): Promise<vscode.Uri|undefined> => {
		await ensureServerListening(context);

		if (serverUri) {
			return await vscode.env.asExternalUri(serverUri);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('remote-adb.stopServer', async () => {
		await server?.stop();
	}));
}

export function deactivate() {}
