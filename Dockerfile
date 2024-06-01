# 使用官方 Node.js 镜像作为基础镜像
FROM node:18.17.0

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制应用代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["npm", "start"]