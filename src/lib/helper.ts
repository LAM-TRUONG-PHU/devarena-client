export const createSlug = (title: string) => {
    const vietnameseMap: { [key: string]: string } = {
      "á": "a", "à": "a", "ả": "a", "ã": "a", "ạ": "a",
      "ấ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ậ": "a",
      "ắ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ặ": "a",
      "é": "e", "è": "e", "ẻ": "e", "ẽ": "e", "ẹ": "e",
      "ế": "e", "ề": "e", "ể": "e", "ễ": "e", "ệ": "e",
      "í": "i", "ì": "i", "ỉ": "i", "ĩ": "i", "ị": "i",
      "ó": "o", "ò": "o", "ỏ": "o", "õ": "o", "ọ": "o",
      "ố": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ộ": "o",
      "ớ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ợ": "o",
      "ú": "u", "ù": "u", "ủ": "u", "ũ": "u", "ụ": "u",
      "ứ": "u", "ừ": "u", "ử": "u", "ữ": "u", "ự": "u",
      "ý": "y", "ỳ": "y", "ỷ": "y", "ỹ": "y", "ỵ": "y",
      "đ": "d", "ă": "a", "â": "a", "ê": "e", "ô": "o", "ơ": "o", "ư": "u",
      "Ă": "A", "Â": "A", "Ê": "E", "Ô": "O", "Ơ": "O", "Ư": "U", "Đ": "D"
    };
  
    // Thay thế tất cả các ký tự có dấu bằng ký tự không dấu
    let slug = title
      .toLowerCase() // Chuyển thành chữ thường
      .split('') // Tách thành mảng các ký tự
      .map(char => vietnameseMap[char] || char) // Thay thế các ký tự có dấu bằng ký tự không dấu
      .join('') // Kết hợp lại thành chuỗi
      .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-"); // Loại bỏ các dấu gạch ngang dư thừa
  
    return slug;
  };
  