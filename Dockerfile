# Sử dụng image Node.js làm base
FROM node:18

# Set thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và cài đặt các dependencies
COPY package*.json ./
RUN yarn

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build project NestJS
RUN yarn build

# Expose port mặc định của NestJS (bạn có thể thay đổi sau)
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["yarn", "start:prod"]