import * as vscode from 'vscode';
import { Server } from 'remote-adb/server';
import { setLogger as setRemoteAdbLogger } from 'remote-adb/logger';

import { logger } from './logger';

let server: Server|undefined = undefined;
let serverUri: vscode.Uri|undefined = undefined;

async function ensureServerListening(context: vscode.ExtensionContext) {
	if (!server) {
		server = new Server(
			{
				port: 0,
				host: "127.0.0.1"
			},
			/* httpsOptions */ undefined,
			{
				staticClientPath: vscode.Uri.joinPath(context.extensionUri, "dist/web").fsPath,
			}
		);
	}

	if (!server.isListening()) {
		serverUri = vscode.Uri.parse(await server.start());
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
