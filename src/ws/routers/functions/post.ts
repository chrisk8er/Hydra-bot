import { spawn } from 'child_process';
import { sessionClient } from '../../help/sessions';
import Users from '../../help/treatment';
import crypto from 'crypto';
import { options } from './../../model/interface';

export const init = new (class InicializePost {
  public child: any;
  public res: any;
  public option: any;

  constructor() {
    this.child = '';
    this.res = '';
    this.option = '';
  }

  async StartSession(req: any, res: any, option: options) {
    const body = req.body;
    const reHttp = /^https?:/;
    const $_HEADERS_USER = req?.headers?.user;
    this.res = res;
    this.option = option;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }

    if (body.url && body.url.length && !reHttp.test(body.url)) {
      return res.sender({ erro: true, text: 'Error http webHook' });
    }

    const session = await sessionClient.newSession($_HEADERS_USER);

    if (session) {
      option.session = $_HEADERS_USER;
      option.url = body.url;

      const spawnArgs = [
        __dirname + '../../../services/hydra.js',
        JSON.stringify(option),
      ];

      this.child = spawn('node', spawnArgs, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      });

      this.child.on('message', async (response: any) => {
        if (response.connect) {
          await sessionClient.addInfoSession(response.session, {
            connect: response.connect,
          });
        }
        if (response.delsession) {
          await sessionClient.deleteSession(response.session);
        }
      });

      this.child.on('disconnect', (err: any) => {
        console.log('disconnect', err ? err : '');
      });

      this.child.on('error', async (err: any) => {
        if (err) {
          console.log('on error', err);
        }
      });

      this.child.on('close', async (code: any) => {
        console.log(`child process exited with code`, code);
      });

      this.child.on('uncaughtException', (err: any) => {
        console.log(err);
      });

      sessionClient.addInfoSession($_HEADERS_USER, { child: this.child });

      return res.send({ erro: false, text: 'Wait for connection' });
    } else {
      const getId = await sessionClient.getSessionId($_HEADERS_USER);
      const check = await sessionClient.checkClient($_HEADERS_USER);

      if (typeof getId === 'number') {
        const client = await sessionClient.checkObjectSession(
          $_HEADERS_USER,
          'connect',
          getId
        );
        if (check && client) {
          return res.send({ erro: false, text: 'Successfully connected!' });
        } else {
          return res.send({ erro: false, text: 'Wait for connection' });
        }
      }
    }
  }

  public async sendtext(req: any, res: any) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;
    this.res = res;

    if (this.option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }

    if (!!body.to && body.to.length && !!body.body && body.body.length) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendText', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendText') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          }
        }
      } else {
        return res.send({
          erro: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        erro: true,
        text: 'The parameters are missing',
      });
    }
  }

  public async sendFile(req: any, res: any) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (this.option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }

    if (
      !!body.to &&
      body.to.length &&
      !!body.file_path &&
      body.file_path.length &&
      !!body.file_name &&
      body.file_name.length
    ) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendFile', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendFile') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          }
        }
      } else {
        return res.send({
          erro: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        erro: true,
        text: 'The parameters are missing',
      });
    }
  }

  public async sendAudio(req: any, res: any) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (this.option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }

    if (!!body.to && body.to.length && !!body.url_mp3 && body.url_mp3.length) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendAudio', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendAudio') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          }
        }
      } else {
        return res.send({
          erro: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        erro: true,
        text: 'The parameters are missing',
      });
    }
  }

  public async sendImage(req: any, res: any) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (this.option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }
    if (
      !!body.to &&
      body.to.length &&
      !!body.url_img &&
      body.url_img.length
    ) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendImage', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendImage') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          } 
        }
      } else {
        return res.send({
          erro: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        erro: true,
        text: 'The parameters are missing',
      });
    }
  }
})();
