module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://healing2021.100steps.top/',
        ws: true,
        changeOrigin: true
      },
      '/wx': {
        target: 'https://healing2021.test.100steps.top/',
        ws: true,
        changeOrigin: true
      },
      '/bbtwoa': {
        target: 'https://apiv3.100steps.top/api/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
