# SignCraft

极简本地工具，两个功能：**签名生成** 与 **RSA 密钥对生成**。全部在浏览器内用 WebCrypto 完成，不向服务器发送任何请求。签名算法与后端 `SignUtils` + `SHA256WithRSAUtils` 完全一致。

## 启动
```bash
npm install
npm run dev
```
浏览器打开 http://localhost:5173

## 签名生成
1. 填参数 JSON（业务字段，空值字段签名前自动剔除）
2. 填 `secretKey` 与 `privateKey`（PKCS#8 Base64，可含 PEM 头）
3. 点「生成签名」
4. 得到待签明文、`sign`、最终请求 JSON，均可一键复制

## 密钥生成
1. 点「生成密钥对」
2. 得到 PKCS#8 Base64 私钥与 X.509 Base64 公钥，均可复制
3. 私钥妥善保管，公钥在服务端配置

## 签名算法（对齐后端）
待签串 = `SignUtils.getSign(params, secretKey)`：
1. 跳过 `null`、空串 `""`、字段名 `sign` / `sign_type`
2. 按字段名 ASCII 升序排序
3. 拼接 `k1=v1&k2=v2&...&key={secretKey}`

`sign = SHA256withRSA(待签串, privateKey)`，输出 Base64。

权威实现：
- `SignUtils.java#getSign`
- `SHA256WithRSAUtils.java#buildRSASignByPrivateKey`

## 单元测试
```bash
npm test
```
- `test/sign.test.js`：Node crypto 路径，固定测试密钥对，断言 signStr 与 sign 稳定可复现
- `test/webcrypto.test.js`：浏览器 WebCrypto 路径，断言与后端输出完全一致

## 安全
- 私钥仅存在于浏览器内存，不落盘、不发送、不提交 Git
- `.gitignore` 已忽略 `.env`、`*.pem`、`*.key`
- 占位符一律用 `<SECRET_KEY>` / `<PRIVATE_KEY>`

## 技术栈
Vite + React + 浏览器 WebCrypto（零后端、零 UI 库）
