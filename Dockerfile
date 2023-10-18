
FROM node:18-alpine

WORKDIR /app

COPY . .

# COPY .gitignore ./
# # COPY prettierrc.json ./
# COPY package*.json ./
# COPY server.js ./
# COPY app.js ./

# COPY backup/ ./backup/
# COPY controllers/ ./controllers/
# COPY db/ ./db/
# COPY middlewares/ ./middlewares/
# COPY public/ ./public/
# COPY routes/ ./routes/
# COPY service/ ./service/
# COPY utils/ ./utils/
# COPY views/ ./views/
# COPY docs/ ./docs/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]