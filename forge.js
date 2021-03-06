// Electron forge configuration for building the app
module.exports = {
  packagerConfig: {
    icon: './icon.icns',
    name: 'IOST Desktop',
    osxSign: true,
    appBundleId: 'com.octalmage.iostdesktop',
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
      ],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        title: 'IOST Desktop',
        icon: './src/assets/icon@2x.png',
        overwrite: true,
        iconSize: 100,
        background: './src/assets/background.png',
        additionalDMGOptions: {
          window: {
            size: {
              height: 392,
              width: 660,
            },
          },
        },
        contents: opts => [
          {
            x: 448,
            y: 235,
            type: 'link',
            path: '/Applications',
          },
          {
            x: 192,
            y: 235,
            type: 'file',
            path: opts.appPath,
          },
        ],
      },
    },
  ],
};
