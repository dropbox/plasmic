const path = require("path");

module.exports = {
  entry: {
    counter: "./src/examples/counter/index.tsx",
    dog_api: "./src/examples/dog_api/index.tsx",
    todos: "./src/examples/todos/index.tsx",
    todog: "./src/examples/todog/index.tsx"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./client/public")
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: path.resolve(__dirname, "tsconfig.json")
        }
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};
