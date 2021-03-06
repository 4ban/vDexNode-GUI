const { openNewGitHubIssue, debugInfo } = require('electron-util')
function vdexnodeMenu (app, shell, mainWindow) {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        },
        {
          type: 'separator'
        }
        // {
        //   role: 'toggledevtools'
        // }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: app.getName() + ': ' + app.getVersion(),
          enabled: false
        },
        {
          label: 'About vDexNode',
          click () {
            require('electron').shell.openExternal('https://volentix.io/vdexnode/')
          }
        },
        {
          label: 'About Volentix',
          click () {
            require('electron').shell.openExternal('https://volentix.io/')
          }
        },
        {
          label: 'Report an Issue…',
          click () {
            const body = `<!-- Please succinctly describe your issue and steps to reproduce it. --> --- ${debugInfo()}`
            openNewGitHubIssue({
              user: 'volentix',
              repo: 'vdexnode-gui',
              body
            })
          }
        }
      ]
    }
  ]

  if (!process.env.PROD) {
    template.unshift({
      label: 'Dev Tools',
      submenu: [
        {
          role: 'toggledevtools'
        },
        {
          label: 'Show App Data',
          click () {
            shell.openItem(app.getPath('userData'))
          }
        }
      ]
    })
  }

  if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function () {
            mainWindow.destroy()
            app.quit()
          }
        }
      ]
    })
    const windowMenu = template.find(function (m) {
      return m.role === 'window'
    })
    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      )
    }
  }

  return template
}

export default vdexnodeMenu
