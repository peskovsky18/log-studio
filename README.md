# LOG Studio — Сайт для скачивания приложения

Красивый и современный лендинг в стиле macOS для загрузки приложения **LOG Studio**.

## Содержимое проекта
- `index.html` — главная страница (Hero блок, сравнительный слайдер Apple Log vs Rec.709, карточки возможностей, инструкция по установке, FAQ).
- `style.css` — стили с темной темой macOS, эффектами стекла (glassmorphism) и мобильной адаптацией.
- `script.js` — интерактивный слайдер сравнения и логика FAQ.
- `assets/` — иконка приложения `icon.png` и демонстрационные кадры Apple Log.
- `downloads/LOG_Studio.dmg` — сам образ приложения для macOS (125 МБ).
- `nginx.conf` — готовый конфиг веб-сервера для развертывания на вашем сервере.

---

## Как запустить рядом с VPN на одном сервере

VPN и веб-сайт **не конфликтуют друг с другом**, потому что работают на разных портах:
- **VPN** (WireGuard, OpenVPN, Outline, Shadowsocks и др.) обычно слушает протокол UDP или собственные порты (например, 51820, 1194 и т.д.).
- **Веб-сайт** слушает стандартные порты HTTP (`80`) и HTTPS (`443`).

### 1. Проверьте занятые порты на сервере
Подключитесь к серверу по SSH и выполните:
```bash
sudo ss -tulpn | grep -E ':(80|443)'
```
- Если вывод пустой — порты 80 и 443 полностью свободны, можно смело ставить **Nginx**.
- Если порт 80 или 443 уже занят веб-сервером или панелью — сайт просто добавляется как новый `server block`.

### 2. Установка Nginx (если еще не установлен)
```bash
sudo apt update
sudo apt install nginx -y
```

### 3. Загрузка сайта на сервер
Выполните с вашего Mac (замените `user@SERVER_IP` на данные вашего сервера):
```bash
# Создаем папку на сервере
ssh user@SERVER_IP "sudo mkdir -p /var/www/logstudio && sudo chown -R \$USER:\$USER /var/www/logstudio"

# Копируем все файлы сайта на сервер
rsync -avz --progress ./ user@SERVER_IP:/var/www/logstudio/
```

### 4. Активация сайта в Nginx
На сервере:
```bash
# Копируем конфиг
sudo cp /var/www/logstudio/nginx.conf /etc/nginx/sites-available/logstudio

# Открываем конфиг и указываем ваш домен вместо YOUR_DOMAIN.COM
sudo nano /etc/nginx/sites-available/logstudio

# Создаем ссылку для активации сайта
sudo ln -s /etc/nginx/sites-available/logstudio /etc/nginx/sites-enabled/

# Проверяем синтаксис
sudo nginx -t

# Перезагружаем Nginx
sudo systemctl reload nginx
```

### 5. Бесплатный SSL-сертификат (HTTPS)
Чтобы у сайта был замочек HTTPS и безопасное скачивание:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d YOUR_DOMAIN.COM -d www.YOUR_DOMAIN.COM
```
Certbot сам настроит HTTPS и автообновление сертификата.
