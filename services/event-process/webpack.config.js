import nodeExternals from 'webpack-node-externals'
import CopyWebpackPlugin from 'copy-webpack-plugin'

module.exports = {
  externals: [nodeExternals()],
  plugins: [new CopyWebpackPlugin(['./db/prisma/schema.prisma'])]
}
