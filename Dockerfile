FROM node:18

# 1. Çalışma dizinini belirle
WORKDIR /app

# 2. package ve lock dosyasını kopyala
COPY package.json pnpm-lock.yaml ./

# 3. pnpm kur ve bağımlılıkları yükle
RUN npm install -g pnpm
RUN pnpm install

# 4. Geri kalan tüm dosyaları kopyala
COPY . .

# 5. Prisma client'ı generate et
RUN pnpm prisma generate

# 6. Gerekirse port aç
EXPOSE 3000

# 7. Uygulamayı başlat
CMD ["pnpm", "dev"]

