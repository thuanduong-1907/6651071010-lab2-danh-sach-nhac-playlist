/**
 * Tiện ích định dạng tiền tệ
 * @param amount Số tiền cần định dạng
 * @param currency Đơn vị tiền tệ (mặc định VND)
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (currency === 'VND' || !currency) {
    return `${formatted} ₫`;
  }
  return `${formatted} ${currency}`;
}

/**
 * Cắt ngắn văn bản nếu vượt quá độ dài quy định và thêm dấu ba chấm
 * @param text Chuỗi văn bản ban đầu
 * @param maxLength Độ dài tối đa cho phép
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Kiểm tra tính hợp lệ của địa chỉ email
 * @param email Chuỗi email cần kiểm tra
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Trì hoãn thực thi hàm cho đến khi qua khoảng thời gian delay không có lời gọi mới
 * @param fn Hàm cần debounce
 * @param delay Thời gian chờ tính bằng mili-giây
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  return debounced as unknown as T;
}
