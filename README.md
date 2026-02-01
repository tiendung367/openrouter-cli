# OpenRouter CLI

[English](#english) | [Tiếng Việt](#tiếng-việt)

<a name="english"></a>
## English

A powerful AI coding assistant CLI powered by OpenRouter. Features agentic capabilities with file system access, command execution, and smart context management.

### Installation

```bash
npm install -g @tiendung-betapcode/openrouter-cli
```

### Setup & Usage

#### Option 1: Quick Start (Recommended)
1.  Run the login command:
    ```bash
    openrouter login
    ```
2.  Follow the instructions:
    *   Go to the Dashboard URL shown.
    *   Get your **Access Code** (8 characters).
    *   Paste the code into the terminal.
3.  Start chatting!
    ```bash
    openrouter
    ```

#### Option 2: Manual API Key (Fallback)
If you cannot use the login server, create a `.env` file in your working directory:

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### Commands

| Command | Description |
|---------|-------------|
| `/model` | Switch AI model (Presets or Fetch from OpenRouter) |
| `/history` | Save chat history to Documents/openrouter |
| `/clear` | Clear chat history |
| `/exit` | Exit CLI |
| `/help` | Show help |

---

<a name="tiếng-việt"></a>
## Tiếng Việt

Trợ lý lập trình AI mạnh mẽ sử dụng OpenRouter. Tích hợp khả năng Agent (tác nhân) với quyền truy cập hệ thống tệp, thực thi lệnh và quản lý ngữ cảnh thông minh.

### Cài đặt

```bash
npm install -g @tiendung-betapcode/openrouter-cli
```

### Thiết lập & Sử dụng

#### Cách 1: Khởi động nhanh (Khuyên dùng)
1.  Chạy lệnh đăng nhập:
    ```bash
    openrouter login
    ```
2.  Làm theo hướng dẫn:
    *   Truy cập URL Dashboard hiển thị trên màn hình.
    *   Lấy **Mã Truy Cập (Access Code)** (8 ký tự).
    *   Dán mã vào terminal.
3.  Bắt đầu chat!
    ```bash
    openrouter
    ```

#### Cách 2: Nhập API Key thủ công (Dự phòng)
Nếu không dùng được server đăng nhập, hãy tạo file `.env` tại thư mục làm việc:

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### Các lệnh hỗ trợ

| Lệnh | Mô tả |
|---------|-------------|
| `/model` | Đổi model AI (Chọn có sẵn hoặc tải từ OpenRouter) |
| `/history` | Lưu lịch sử chat vào Documents/openrouter |
| `/clear` | Xóa bộ nhớ đệm đoạn chat |
| `/exit` | Thoát CLI |
| `/help` | Xem trợ giúp |

## Architecture / Kiến trúc

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│  OpenRouter CLI │────>│  API Server      │────>│  Firebase     │
│  (Public/npm)   │     │  (Private/Vercel)│     │  (Keys/History)│
└─────────────────┘     └──────────────────┘     └───────────────┘
```

## License

MIT © TIENDUNG
