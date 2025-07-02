# Phân tích dự án Reflex English

## 1. Mục đích dự án
Reflex English là ứng dụng giúp người dùng luyện nói tiếng Anh trong các tình huống thực tế thông qua hội thoại với AI. Ứng dụng sử dụng AI (Google Gemini) để đóng vai các nhân vật khác nhau, hỗ trợ người học luyện phản xạ giao tiếp, phát âm, và nhận phản hồi tức thì.

## 2. Kiến trúc tổng quan
- **Frontend**: React + TypeScript, sử dụng Vite để build và phát triển.
- **AI Service**: Tích hợp Google Gemini API để tạo hội thoại và sinh nội dung hỗ trợ.
- **Speech**: Sử dụng Web Speech API cho nhận diện giọng nói và tổng hợp giọng nói (speech recognition & synthesis).
- **Quản lý kịch bản**: Cho phép chọn hoặc tự tạo các tình huống hội thoại (scenario).

## 3. Các thành phần chính
- `App.tsx`: Thành phần gốc, quản lý trạng thái kịch bản, modal tạo kịch bản mới, và kiểm tra cấu hình API key.
- `components/ScenarioSelector.tsx`: Hiển thị danh sách các tình huống hội thoại, cho phép chọn hoặc tạo mới.
- `components/ChatView.tsx`: Giao diện hội thoại chính, tích hợp nhận diện giọng nói, phản hồi AI, hiển thị phản hồi phát âm, và các modal trợ giúp/cài đặt.
- `components/CreateScenarioModal.tsx`: Modal cho phép người dùng tự tạo tình huống hội thoại mới với persona AI tùy chỉnh.
- `components/HelpModal.tsx`: Hiển thị gợi ý câu nói, mẹo ngữ pháp, và lưu ý phát âm do AI sinh ra.
- `components/SettingsModal.tsx`: Cài đặt giọng đọc cho tính năng tổng hợp giọng nói.
- `hooks/useSpeech.ts`: Custom hook quản lý nhận diện và tổng hợp giọng nói.
- `services/geminiService.ts`: Lớp kết nối và giao tiếp với Google Gemini API, quản lý hội thoại, sinh nội dung trợ giúp, phản hồi phát âm.
- `constants.ts`: Định nghĩa các tình huống hội thoại mẫu.
- `types.ts`: Định nghĩa các kiểu dữ liệu chính (Scenario, HelpContent, ChatMessage, ...).

## 4. Luồng hoạt động chính
1. Người dùng chọn hoặc tạo một tình huống hội thoại.
2. AI (Gemini) đóng vai nhân vật phù hợp, bắt đầu hội thoại.
3. Người dùng nói (hoặc gõ) câu trả lời, hệ thống nhận diện giọng nói và gửi lên AI.
4. AI phản hồi lại, đồng thời sinh phản hồi về phát âm cho người dùng.
5. Nếu gặp khó khăn, người dùng có thể mở modal trợ giúp để nhận gợi ý câu nói, mẹo ngữ pháp, và lưu ý phát âm.
6. Người dùng có thể thay đổi giọng đọc AI trong phần cài đặt.

## 5. Công nghệ sử dụng
- **React 19, ReactDOM**: Xây dựng giao diện người dùng.
- **TypeScript**: Kiểm soát kiểu dữ liệu, tăng độ an toàn.
- **Vite**: Công cụ build và phát triển nhanh.
- **@google/genai**: SDK kết nối Google Gemini API.
- **Web Speech API**: Nhận diện và tổng hợp giọng nói trên trình duyệt.
- **TailwindCSS**: Thiết kế giao diện hiện đại, hỗ trợ dark mode.

## 6. Hướng dẫn chạy dự án
### Chạy local
1. Cài Node.js (>= 18).
2. Cài dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env.local` và thêm API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Chạy dev:
   ```bash
   npm run dev
   ```
5. Build và preview production:
   ```bash
   npm run build
   npm start
   ```

## 7. Ghi chú
- Ứng dụng yêu cầu quyền microphone.
- Có thể mở rộng thêm các tình huống hội thoại hoặc persona AI mới.
- Đảm bảo API key hợp lệ để sử dụng đầy đủ tính năng AI. 