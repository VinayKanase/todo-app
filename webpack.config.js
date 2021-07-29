const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/js",
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"bundle.js"
    },
    devServer:{
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use:['style-loader','css-loader']
            }
        ]
    }
}