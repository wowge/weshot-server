const html =
`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>腾讯云微信小程序服务器 Demo - Node.js</title>
    <style type="text/css">

    ::selection { background-color: #327F2D; color: white; }
    ::-moz-selection { background-color: #327F2D; color: white; }

    body {
        background-color: #fff;
        margin: 40px;
        font: 13px/20px normal Helvetica, Arial, sans-serif;
        color: #4F5155;
    }

    a {
        color: #003399;
        background-color: transparent;
        font-weight: normal;
        text-decoration: none;
    }

    h1 {
        color: #444;
        background-color: transparent;
        border-bottom: 1px solid #D0D0D0;
        font-size: 19px;
        font-weight: normal;
        margin: 0 0 14px 0;
        padding: 14px 0;
    }

    #container {
        margin: 10px;
        padding: 10px 20px;
        border: 1px solid #D0D0D0;
        box-shadow: 0 0 8px #D0D0D0;
    }
    </style>
</head>
<body>
    <div id="container">
        
    </div>
</body>
</html>
`;

module.exports = (req, res) => {
    res.send(html);
};