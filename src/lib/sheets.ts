import { ThemeKey } from '@/config/themes';

export interface Product {
  id: string;
  name: string;
  brand: string;
  theme_id: ThemeKey | string;
  tone: string;
  occasion: string;
  gender: string;
  price_decant: number;
  price_full?: number;
  top_notes: string;
  mid_notes: string;
  base_notes: string;
  longevity: string;
  sillage: string;
  short_review: string;
  thumb_url: string;
  gallery_urls: string;
  badge: string;
  is_in_stock: boolean;
}

/**
 * Chuyển đổi link Google Drive public sang định dạng ảnh trực tiếp:
 * https://lh3.googleusercontent.com/d/{id}
 */
export function formatDriveUrl(url: string): string {
  if (!url) return '';
  let cleanUrl = url.trim();

  // Bóc tách nếu URL nằm trong markdown link [text](url)
  const mdMatch = cleanUrl.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch) {
    cleanUrl = mdMatch[1];
  }

  // Khớp định dạng /file/d/{id}
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Khớp định dạng ?id={id} hoặc &id={id}
  const idParamMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  return cleanUrl;
}

/**
 * Danh sách mock data dự phòng (Fallback) khi Google Sheet ID chưa public hoặc mất kết nối
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'dp-01',
    name: 'Delina Exclusif',
    brand: 'Parfums de Marly',
    theme_id: 'sweet_rose',
    tone: 'Ngọt ngào, tiểu thư quý tộc',
    occasion: 'Hẹn hò, Tiệc sang trọng',
    gender: 'Nữ',
    price_decant: 480000,
    price_full: 6200000,
    top_notes: 'Quả vải, Quả lê, Cam bergamot',
    mid_notes: 'Hoa hồng Thổ Nhĩ Kỳ, Trầm hương, Gỗ Oud',
    base_notes: 'Hương Vani, Hổ phách, Hương gỗ',
    longevity: '10 - 12 giờ',
    sillage: 'Tỏa xa trong bán kính 2 mét',
    short_review: 'Mùi hương hoa hồng ngọt ngào nịnh mũi nhất từng ngửi. Sang chảnh, kiêu kỳ như một nàng công chúa.',
    thumb_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    is_in_stock: true,
  },
  {
    id: 'dp-02',
    name: 'Wood Sage & Sea Salt',
    brand: 'Jo Malone London',
    theme_id: 'fresh_water',
    tone: 'Thanh mát, tự do biển cả',
    occasion: 'Đi làm, Dạo phố, Mùa hè',
    gender: 'Unisex',
    price_decant: 350000,
    price_full: 3600000,
    top_notes: 'Hạt vông vang, Muối biển',
    mid_notes: 'Xô thơm (Sage)',
    base_notes: 'Tảo đỏ, Bưởi chùm',
    longevity: '5 - 6 giờ',
    sillage: 'Thoang thoảng nhẹ nhàng trên da',
    short_review: 'Cảm giác sạch sẽ như một cơn gió mát lạnh từ bờ biển Địa Trung Hải thổi qua vách đá.',
    thumb_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    badge: 'Mùa Hè',
    is_in_stock: true,
  },
  {
    id: 'dp-03',
    name: 'Jazz Club',
    brand: 'Maison Margiela Replica',
    theme_id: 'warm_amber',
    tone: 'Ấm áp, say đắm rượu & khói',
    occasion: 'Tiệc đêm, Bar, Mùa đông',
    gender: 'Unisex',
    price_decant: 390000,
    price_full: 3400000,
    top_notes: 'Tiêu hồng, Hoa cam, Chanh vàng',
    mid_notes: 'Rượu Rum, Cỏ hương bài, Xô thơm',
    base_notes: 'Lá thuốc lá, Đậu Tonka, Vani',
    longevity: '8 - 10 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Mùi của góc quán jazz cổ điển lúc nửa đêm. Trầm ấm, gợi cảm và đầy mê hoặc.',
    thumb_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    badge: 'Must-Try',
    is_in_stock: true,
  },
  {
    id: 'dp-04',
    name: 'Philosykos',
    brand: 'Diptyque',
    theme_id: 'green_nature',
    tone: 'Xanh tươi, quả sung & thảo mộc',
    occasion: 'Hàng ngày, Thư giãn, Đi chơi',
    gender: 'Unisex',
    price_decant: 420000,
    price_full: 4200000,
    top_notes: 'Lá sung, Quả sung non',
    mid_notes: 'Hương dừa, Nốt hương xanh',
    base_notes: 'Cây sung, Gỗ tuyết tùng',
    longevity: '6 - 7 giờ',
    sillage: 'Toả thoang thoảng dịu mắt',
    short_review: 'Như đang bẻ một nhánh lá sung tươi mọng nước giữa khu vườn Hy Lạp đầy nắng râm.',
    thumb_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    badge: 'Hot Pick',
    is_in_stock: true,
  },
  {
    id: 'dp-05',
    name: 'Black Orchid',
    brand: 'Tom Ford',
    theme_id: 'dark_mystery',
    tone: 'Bí ẩn, ma mị & vương giả',
    occasion: 'Dạ tiệc, Đi bar, Quyến rũ',
    gender: 'Unisex / Nam & Nữ cá tính',
    price_decant: 490000,
    price_full: 4800000,
    top_notes: 'Nấm truffle đen, Quả lý chua đen, Ylang-ylang',
    mid_notes: 'Hoa phong lan đen, Hương sen, Gia vị cay',
    base_notes: 'Hoắc hương, Sô-cô-la đen, Hương trầm, Vani',
    longevity: '12+ giờ',
    sillage: 'Tỏa ngút ngàn, ấn tượng mạnh',
    short_review: 'Kẻ thống trị màn đêm. Đậm đặc, bí ẩn và quyền lực tột cùng.',
    thumb_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    badge: 'Đẳng Cấp',
    is_in_stock: true,
  },
  {
    id: 'dp-06',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    theme_id: 'dark_mystery',
    tone: 'Ngọt ngào hổ phách, kẹo bông & gỗ tuyết tùng',
    occasion: 'Sự kiện đặc biệt, Tiệc đêm xa hoa',
    gender: 'Unisex',
    price_decant: 650000,
    price_full: 8200000,
    top_notes: 'Hoa nghệ tây (Saffron), Hoa nhài',
    mid_notes: 'Hổ phách xám (Amberwood), Long diên hương',
    base_notes: 'Nhựa linh sam, Gỗ tuyết tùng',
    longevity: '14+ giờ',
    sillage: 'Tỏa ngào ngạt, để lại vệt hương khó quên',
    short_review: 'Mùi hương của giới thượng lưu. Lấp lánh như pha lê đỏ dưới ánh đèn chùm lộng lẫy.',
    thumb_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    badge: 'Iconic',
    is_in_stock: true,
  },
  {
    id: 'dp-07',
    name: 'Sailing Day',
    brand: 'Maison Margiela Replica',
    theme_id: 'fresh_water',
    tone: 'Xanh thẳm đại dương, tươi mát',
    occasion: 'Mùa hè, Đi biển, Thể thao',
    gender: 'Unisex',
    price_decant: 370000,
    price_full: 3400000,
    top_notes: 'Hương biển, Aldehydes, Rau mùi',
    mid_notes: 'Cây bách xù, Hoa hồng, Hoa diên vĩ',
    base_notes: 'Rong biển, Long diên hương, Gỗ tuyết tùng',
    longevity: '6 - 8 giờ',
    sillage: 'Vừa phải, thanh lịch',
    short_review: 'Hơi thở tinh khiết của biển xanh bao la trong một ngày giong buồm lộng gió.',
    thumb_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    badge: 'Bán Chạy',
    is_in_stock: true,
  },
  {
    id: 'dp-08',
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    theme_id: 'warm_amber',
    tone: 'Ấm áp, thuốc lá thượng hạng & vani béo ngậy',
    occasion: 'Mùa thu đông, Buổi tối, Gặp đối tác',
    gender: 'Unisex',
    price_decant: 520000,
    price_full: 6800000,
    top_notes: 'Lá thuốc lá, Nốt hương cay nồng',
    mid_notes: 'Đậu Tonka, Hoa thuốc lá, Vani, Ca cao',
    base_notes: 'Hương trái cây khô, Nốt hương gỗ quý',
    longevity: '12 - 14 giờ',
    sillage: 'Nồng nàn, ấn tượng mạnh',
    short_review: 'Sự kết hợp hoàn hảo giữa vị ngọt béo của vani và vị đắng khói của lá thuốc lá xì gà.',
    thumb_url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    badge: 'Kinh Điển',
    is_in_stock: true,
  },
];

interface GvizCell {
  v?: string | number | boolean | null;
  f?: string | null;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

interface GvizResponse {
  table?: {
    rows?: GvizRow[];
  };
}

/**
 * Fetch danh sách sản phẩm từ Google Sheet (hoặc fallback về mock data nếu lỗi)
 */
export async function getPerfumeProducts(): Promise<{ products: Product[]; isFallback: boolean; error?: string }> {
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  const gid = process.env.NEXT_PUBLIC_SHEET_GID || '1794140804';

  if (!sheetId) {
    console.warn('[getPerfumeProducts] NEXT_PUBLIC_GOOGLE_SHEET_ID chưa được cấu hình. Sử dụng mock data.');
    return { products: MOCK_PRODUCTS, isFallback: true, error: 'Chưa cấu hình NEXT_PUBLIC_GOOGLE_SHEET_ID' };
  }

  const endpoint = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60 }, // ISR cache revalidate mỗi 60 giây
    });

    if (!res.ok) {
      throw new Error(`Google Sheets phản hồi mã trạng thái HTTP ${res.status}`);
    }

    const text = await res.text();

    // Bóc tách JSON từ hàm setResponse(...)
    const startIndex = text.indexOf('(');
    const endIndex = text.lastIndexOf(')');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Dữ liệu Google Sheets không đúng định dạng JSON gviz (Kiểm tra quyền truy cập Sheet)');
    }

    const jsonString = text.substring(startIndex + 1, endIndex);
    const gvizData = JSON.parse(jsonString) as GvizResponse;

    const rows = gvizData.table?.rows;
    if (!rows || !Array.isArray(rows)) {
      throw new Error('Bảng tính không có dữ liệu hàng nào');
    }

    const products: Product[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row.c) continue;

      const getVal = (index: number): unknown => {
        return row.c[index]?.v;
      };

      const rawId = getVal(0);
      const rawName = getVal(1);

      // Bỏ qua dòng trống hoặc dòng tiêu đề lặp lại
      if (!rawId || !rawName) continue;
      const strId = String(rawId).trim();
      const strName = String(rawName).trim();
      if (strId.toLowerCase() === 'id' || strName.toLowerCase() === 'name') continue;

      const rawPriceDecant = Number(getVal(7)) || 0;
      const rawPriceFull = getVal(8) ? Number(getVal(8)) : undefined;
      const rawStock = getVal(18);
      const isInStock = rawStock === true || String(rawStock).toUpperCase() === 'TRUE';

      const product: Product = {
        id: strId,
        name: strName,
        brand: String(getVal(2) ?? '').trim(),
        theme_id: String(getVal(3) ?? 'sweet_rose').trim(),
        tone: String(getVal(4) ?? '').trim(),
        occasion: String(getVal(5) ?? '').trim(),
        gender: String(getVal(6) ?? '').trim(),
        price_decant: rawPriceDecant,
        price_full: rawPriceFull,
        top_notes: String(getVal(9) ?? '').trim(),
        mid_notes: String(getVal(10) ?? '').trim(),
        base_notes: String(getVal(11) ?? '').trim(),
        longevity: String(getVal(12) ?? '').trim(),
        sillage: String(getVal(13) ?? '').trim(),
        short_review: String(getVal(14) ?? '').trim(),
        thumb_url: formatDriveUrl(String(getVal(15) ?? '')),
        gallery_urls: String(getVal(16) ?? '').trim(),
        badge: String(getVal(17) ?? '').trim(),
        is_in_stock: isInStock,
      };

      products.push(product);
    }

    if (products.length === 0) {
      console.warn('[getPerfumeProducts] Sheet không có dữ liệu hợp lệ, sử dụng mock data.');
      return { products: MOCK_PRODUCTS, isFallback: true };
    }

    return { products, isFallback: false };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[getPerfumeProducts] Lỗi fetch Google Sheet: ${errorMsg}. Đang sử dụng mock data fallback.`);
    return {
      products: MOCK_PRODUCTS,
      isFallback: true,
      error: errorMsg,
    };
  }
}
