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
    name: 'Wood Sage & Sea Salt',
    brand: 'Jo Malone London',
    theme_id: 'fresh_water',
    tone: 'Thanh mát, tự do biển cả',
    occasion: 'Đi làm, Mùa hè, Dạo phố',
    gender: 'Unisex',
    price_decant: 350000,
    price_full: 3600000,
    top_notes: 'Muối biển, Hạt vông vang',
    mid_notes: 'Xô thơm (Sage)',
    base_notes: 'Tảo đỏ, Bưởi chùm',
    longevity: '6 - 8 giờ',
    sillage: 'Thoang thoảng gần da',
    short_review: 'Cảm giác sạch sẽ như một cơn gió mát lạnh từ bờ biển Địa Trung Hải thổi qua vách đá.',
    thumb_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    badge: 'Hot Summer',
    is_in_stock: true,
  },
  {
    id: 'dp-02',
    name: 'Acqua Di Gio Profondo',
    brand: 'Giorgio Armani',
    theme_id: 'fresh_water',
    tone: 'Mát lạnh biển sâu, nam tính',
    occasion: 'Hẹn hò, Thể thao, Hè',
    gender: 'Nam / Unisex',
    price_decant: 320000,
    price_full: 3200000,
    top_notes: 'Nốt hương biển, Cam Bergamot, Quýt xanh',
    mid_notes: 'Hương thảo, Oải hương, Bách xù',
    base_notes: 'Hoắc hương, Xạ hương, Hổ phách khoáng',
    longevity: '7 - 9 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Mùi hương của người đàn ông mặc sơ mi trắng bước ra từ bãi biển xanh ngắt.',
    thumb_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    badge: 'Classic',
    is_in_stock: true,
  },
  {
    id: 'dp-03',
    name: 'Jazz Club',
    brand: 'Maison Margiela',
    theme_id: 'warm_amber',
    tone: 'Ấm áp, say đắm rượu rum & khói',
    occasion: 'Tiệc đêm, Hẹn hò, Mùa đông',
    gender: 'Unisex',
    price_decant: 390000,
    price_full: 3400000,
    top_notes: 'Tiêu hồng, Hoa cam, Chanh vàng',
    mid_notes: 'Rượu Rum, Cỏ hương bài, Cây xô thơm',
    base_notes: 'Lá thuốc lá, Đậu Tonka, Vani ngọt',
    longevity: '8 - 10 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Mùi của quán bar jazz cổ điển lúc nửa đêm. Trầm ấm, gợi cảm và đầy sự quyến rũ.',
    thumb_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    is_in_stock: true,
  },
  {
    id: 'dp-04',
    name: 'Santal 33',
    brand: 'Le Labo',
    theme_id: 'warm_amber',
    tone: 'Gỗ đàn hương khói mộc mạc',
    occasion: 'Cá tính, Đi chơi, Thu đông',
    gender: 'Unisex',
    price_decant: 490000,
    price_full: 6800000,
    top_notes: 'Bạch đậu khấu, Hoa diên vĩ, Hoa violet',
    mid_notes: 'Hương khói, Giấy cói (Papyrus)',
    base_notes: 'Gỗ đàn hương, Gỗ tuyết tùng, Da thuộc',
    longevity: '10 - 14 giờ',
    sillage: 'Toả xa 2 mét',
    short_review: 'Chữ ký mùi hương của dân sành điệu. Mùi gỗ nồng nàn, sang trọng và độc bản.',
    thumb_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    badge: 'Iconic',
    is_in_stock: true,
  },
  {
    id: 'dp-05',
    name: 'Philosykos',
    brand: 'Diptyque',
    theme_id: 'green_nature',
    tone: 'Xanh tươi, lá sung non & vỏ cây',
    occasion: 'Thư giãn, Hàng ngày, Xuân hè',
    gender: 'Unisex',
    price_decant: 420000,
    price_full: 4200000,
    top_notes: 'Lá sung non, Quả sung',
    mid_notes: 'Hương dừa, Nốt hương cỏ xanh',
    base_notes: 'Cây sung, Gỗ tuyết tùng',
    longevity: '6 - 8 giờ',
    sillage: 'Thoang thoảng nhẹ dịu',
    short_review: 'Như vừa bẻ một nhánh sung non tươi mọng nước giữa trưa hè đầy nắng.',
    thumb_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    badge: 'Pure Natural',
    is_in_stock: true,
  },
  {
    id: 'dp-06',
    name: 'Wulong Cha',
    brand: 'Nishane',
    theme_id: 'green_nature',
    tone: 'Trà ô long thanh tao, cam quýt',
    occasion: 'Văn phòng sang trọng, Mùa nóng',
    gender: 'Unisex',
    price_decant: 480000,
    price_full: 4600000,
    top_notes: 'Cam Bergamot, Quýt, Vải thiều',
    mid_notes: 'Trà Ô Long, Nhục đậu khấu',
    base_notes: 'Xạ hương trắng, Quả sung',
    longevity: '8 - 10 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Tách trà thượng hạng thanh tao bậc nhất thế giới nước hoa niche. Thơm sảng khoái và cực sang.',
    thumb_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Must Try',
    is_in_stock: true,
  },
  {
    id: 'dp-07',
    name: 'Delina Exclusif',
    brand: 'Parfums de Marly',
    theme_id: 'sweet_rose',
    tone: 'Hoa hồng quý tộc, kiêu kỳ',
    occasion: 'Hẹn hò, Tiệc lộng lẫy',
    gender: 'Nữ',
    price_decant: 480000,
    price_full: 6200000,
    top_notes: 'Quả vải, Quả lê, Cam Bergamot',
    mid_notes: 'Hoa hồng Thổ Nhĩ Kỳ, Trầm hương, Gỗ Oud',
    base_notes: 'Hương Vani, Hổ phách ấm, Hương gỗ',
    longevity: '10 - 12 giờ',
    sillage: 'Toả xa 2 mét',
    short_review: 'Xịt em này lên là biến hình thành tiểu thư tài phiệt. Ngọt ngào, nịnh mũi và quyến rũ không lối thoát.',
    thumb_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Nữ Hoàng',
    is_in_stock: true,
  },
  {
    id: 'dp-08',
    name: 'Rose Prick',
    brand: 'Tom Ford',
    theme_id: 'sweet_rose',
    tone: 'Bụi hồng gai góc, ngọt ngào',
    occasion: 'Dạo phố, Tiệc cocktail',
    gender: 'Unisex / Nữ',
    price_decant: 550000,
    price_full: 7500000,
    top_notes: 'Tiêu Tứ Xuyên, Củ nghệ',
    mid_notes: 'Hoa hồng tháng Năm, Hoa hồng Thổ Nhĩ Kỳ, Hoa hồng Bulgaria',
    base_notes: 'Cây hoắc hương, Đậu Tonka',
    longevity: '8 - 10 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Một bó hồng gai góc vừa hiểm hóc vừa mê đắm lòng người.',
    thumb_url: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    badge: 'Luxury',
    is_in_stock: true,
  },
  {
    id: 'dp-09',
    name: 'Black Orchid',
    brand: 'Tom Ford',
    theme_id: 'dark_mystery',
    tone: 'Bí ẩn, nấm truffle & socola đen',
    occasion: 'Dạ tiệc, Đi bar, Quyến rũ ma mị',
    gender: 'Unisex',
    price_decant: 450000,
    price_full: 4800000,
    top_notes: 'Nấm Truffle đen, Quả lý chua, Ylang-ylang',
    mid_notes: 'Hoa phong lan đen, Hương sen cay',
    base_notes: 'Hoắc hương, Socola đen, Nhang trầm, Vani',
    longevity: '12+ giờ',
    sillage: 'Toả ngút ngàn',
    short_review: 'Mùi của kẻ nắm giữ quyền lực trong màn đêm. Đậm đà, ma mị và để lại ấn tượng khó phai.',
    thumb_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    badge: 'Ma Mị',
    is_in_stock: true,
  },
  {
    id: 'dp-10',
    name: 'Baccarat Rouge 540 Extrait',
    brand: 'Maison Francis Kurkdjian',
    theme_id: 'dark_mystery',
    tone: 'Kẹo bông hổ phách & hạnh nhân',
    occasion: 'Sự kiện VIP, Đêm lạnh',
    gender: 'Unisex',
    price_decant: 650000,
    price_full: 8900000,
    top_notes: 'Hạnh nhân đắng, Nhụy hoa nghệ tây (Saffron)',
    mid_notes: 'Hoa nhài Grandiflorum, Gỗ tuyết tùng',
    base_notes: 'Long diên hương (Ambergris), Hương gỗ, Xạ hương',
    longevity: '14+ giờ',
    sillage: 'Toả xa phòng kín',
    short_review: 'Mùi hương triệu đô. Tinh thể pha lê lấp lánh và đắt tiền ngút ngàn trên da.',
    thumb_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    badge: 'VIP Pick',
    is_in_stock: true,
  },
  {
    id: 'dp-11',
    name: 'Bleu de Chanel Parfum',
    brand: 'Chanel',
    theme_id: 'fresh_water',
    tone: 'Gỗ tuyết tùng & hương bưởi tươi',
    occasion: 'Văn phòng, Hẹn hò, Quanh năm',
    gender: 'Nam / Unisex',
    price_decant: 420000,
    price_full: 4900000,
    top_notes: 'Vỏ chanh, Cam Bergamot, Bạc hà',
    mid_notes: 'Hoa oải hương, Phong lữ, Quả thơm',
    base_notes: 'Gỗ tuyết tùng, Đàn hương, Hổ phách',
    longevity: '8 - 10 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Đỉnh cao của sự lịch thiệp. Vừa có vị thanh mát của bưởi chanh, vừa có chiều sâu của gỗ sang trọng.',
    thumb_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    badge: 'Top Seller',
    is_in_stock: true,
  },
  {
    id: 'dp-12',
    name: 'Sedley',
    brand: 'Parfums de Marly',
    theme_id: 'fresh_water',
    tone: 'Bạc hà sảng khoái & chanh đá',
    occasion: 'Mùa hè nóng bức, Thể thao',
    gender: 'Unisex',
    price_decant: 450000,
    price_full: 5600000,
    top_notes: 'Bạc hà, Chanh vàng, Bưởi, Cam Bergamot',
    mid_notes: 'Hương thảo, Oải hương, Nhũ hương',
    base_notes: 'Ambroxan, Gỗ đàn hương, Hoắc hương',
    longevity: '7 - 9 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Cảm giác sảng khoái như uống một ly cocktail mojito chanh bạc hà lạnh ngắt giữa trưa nắng rực.',
    thumb_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    badge: 'Summer Vibe',
    is_in_stock: true,
  },
  {
    id: 'dp-13',
    name: 'Silver Mountain Water',
    brand: 'Creed',
    theme_id: 'fresh_water',
    tone: 'Băng tuyết dãy Alps & trà xanh',
    occasion: 'Công sở thanh lịch, Gặp gỡ đối tác',
    gender: 'Unisex',
    price_decant: 590000,
    price_full: 7200000,
    top_notes: 'Cam Bergamot, Quýt Mandarine',
    mid_notes: 'Trà xanh, Quả lý chua đen',
    base_notes: 'Xạ hương trắng, Gỗ đàn hương, Tinh dầu lá chanh',
    longevity: '7 - 8 giờ',
    sillage: 'Thoang thoảng gần da',
    short_review: 'Nốt hương trong vắt tựa dòng suối băng tuyết tan chảy giữa rặng núi Thụy Sĩ. Đẳng cấp vương giả.',
    thumb_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Quý Tộc',
    is_in_stock: true,
  },
  {
    id: 'dp-14',
    name: 'Un Jardin Sur Le Nil',
    brand: 'Hermès',
    theme_id: 'fresh_water',
    tone: 'Xoài xanh, hoa sen & hương phù sa',
    occasion: 'Dạo phố cuối tuần, Thư thái',
    gender: 'Unisex',
    price_decant: 350000,
    price_full: 3400000,
    top_notes: 'Quả xoài xanh, Bưởi, Cà rốt',
    mid_notes: 'Hoa sen, Cây bồ đề, Hoa mẫu đơn',
    base_notes: 'Xạ hương, Trầm hương, Quế',
    longevity: '6 - 7 giờ',
    sillage: 'Thoang thoảng tinh tế',
    short_review: 'Một khu vườn hoa sen nở rộ ven bờ sông Nin với những quả xoài xanh chua giòn tươi mát.',
    thumb_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    badge: 'Nghệ Thuật',
    is_in_stock: true,
  },
  {
    id: 'dp-15',
    name: 'Light Blue Eau Intense',
    brand: 'Dolce & Gabbana',
    theme_id: 'fresh_water',
    tone: 'Chanh vàng Địa Trung Hải & xạ hương',
    occasion: 'Đi biển, Du lịch, Mùa hè',
    gender: 'Nữ / Unisex',
    price_decant: 290000,
    price_full: 2700000,
    top_notes: 'Chanh vàng, Táo xanh Granny Smith',
    mid_notes: 'Hoa cúc kim tiền, Hoa nhài',
    base_notes: 'Gỗ hổ phách, Xạ hương',
    longevity: '8 - 10 giờ',
    sillage: 'Toả xa 1.5 mét',
    short_review: 'Tươi rói, mọng nước và siêu bám tỏa. Nữ hoàng của những chuyến vi vu miền biển nắng gió.',
    thumb_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    badge: 'Must Have',
    is_in_stock: true,
  },
  {
    id: 'dp-16',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    theme_id: 'sweet_rose',
    tone: 'Tiểu thư hoa mẫu đơn & hoa hồng',
    occasion: 'Đi học, Đi làm, Hẹn hò nhẹ nhàng',
    gender: 'Nữ',
    price_decant: 350000,
    price_full: 3600000,
    top_notes: 'Quýt hồng Sicili',
    mid_notes: 'Hoa hồng Đan Mạch, Hoa mẫu đơn hồng, Quả mơ',
    base_notes: 'Xạ hương trắng',
    longevity: '5 - 6 giờ',
    sillage: 'Thoang thoảng e ấp',
    short_review: 'Chiếc váy hoa mềm mại của một nàng thơ mùa xuân. Ngọt ngào, trong trẻo và ngây thơ.',
    thumb_url: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    badge: 'Nàng Thơ',
    is_in_stock: true,
  },
  {
    id: 'dp-17',
    name: "Rose of No Man's Land",
    brand: 'Byredo',
    theme_id: 'sweet_rose',
    tone: 'Hoa hồng khô tinh tế & tiêu hồng',
    occasion: 'Gặp gỡ, Cafe sang chảnh, Thu đông',
    gender: 'Unisex / Nữ',
    price_decant: 480000,
    price_full: 5200000,
    top_notes: 'Cánh hoa hồng Thổ Nhĩ Kỳ, Hạt tiêu hồng',
    mid_notes: 'Hoa hồng Thổ Nhĩ Kỳ, Hoa mâm xôi',
    base_notes: 'Hổ phách trắng, Giấy cói Papyrus',
    longevity: '7 - 9 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Đóa hồng kiên cường giữa sa mạc. Không quá ngọt gắt mà mang vẻ thanh cao, trầm tĩnh khó cưỡng.',
    thumb_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Niche Pick',
    is_in_stock: true,
  },
  {
    id: 'dp-18',
    name: 'Portrait of a Lady',
    brand: 'Frederic Malle',
    theme_id: 'sweet_rose',
    tone: '400 bông hồng Thổ Nhĩ Kỳ & hoắc hương',
    occasion: 'Dạ tiệc quý tộc, Quyến rũ quyền lực',
    gender: 'Nữ / Unisex',
    price_decant: 620000,
    price_full: 7800000,
    top_notes: 'Hoa hồng, Đinh hương, Mâm xôi, Nho đen',
    mid_notes: 'Cây hoắc hương, Nhang trầm, Gỗ đàn hương',
    base_notes: 'Hổ phách, Xạ hương trắng, Nhựa bồ đề',
    longevity: '12+ giờ',
    sillage: 'Toả xa phòng kín',
    short_review: 'Kiệt tác hoa hồng quyền lực nhất hành tinh. Đậm đà, ma mị và tỏa ra khí chất nữ vương tuyệt đối.',
    thumb_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    badge: 'Tuyệt Tác',
    is_in_stock: true,
  },
  {
    id: 'dp-19',
    name: 'Roses Vanille',
    brand: 'Mancera',
    theme_id: 'sweet_rose',
    tone: 'Hoa hồng tẩm đường & vani béo ngậy',
    occasion: 'Tiệc đêm, Mùa lạnh, Hẹn hò ngọt ngào',
    gender: 'Nữ',
    price_decant: 320000,
    price_full: 3100000,
    top_notes: 'Chanh vàng Calbria, Nốt hương nước',
    mid_notes: 'Hoa hồng ngọt ngào, Đường cát',
    base_notes: 'Vani Madagascar, Xạ hương trắng, Gỗ tuyết tùng',
    longevity: '10 - 12 giờ',
    sillage: 'Toả xa 2 mét',
    short_review: 'Mùi của một chiếc bánh kem hoa hồng ngọt lịm. Đàn ông ngửi vào là chỉ muốn nếm thử ngay lập tức!',
    thumb_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    badge: 'Gây Nghiện',
    is_in_stock: true,
  },
  {
    id: 'dp-20',
    name: 'La Nuit Trésor',
    brand: 'Lancôme',
    theme_id: 'sweet_rose',
    tone: 'Hoa hồng đen, kẹo hạt dẻ & vải thiều',
    occasion: 'Hẹn hò lãng mạn, Phòng the',
    gender: 'Nữ',
    price_decant: 380000,
    price_full: 3500000,
    top_notes: 'Lê, Cam Bergamot, Quả quýt',
    mid_notes: 'Hoa phong lan Vani, Hoa hồng đen, Quả chanh dây, Dâu tây',
    base_notes: 'Hoắc hương, Kẹo hạt dẻ Praline, Vani, Cà phê',
    longevity: '9 - 11 giờ',
    sillage: 'Trong vòng 1 cánh tay',
    short_review: 'Viên kim cương đen quyến rũ chết người. Hương thơm của sự thăng hoa cảm xúc trong đêm hẹn hò say đắm.',
    thumb_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    badge: 'Sexy Night',
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
      cache: 'no-store', // Không lưu cache tĩnh, luôn lấy dữ liệu mới nhất từ Sheet
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
        theme_id: String(getVal(3) ?? 'sweet_rose').trim().toLowerCase(),
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
