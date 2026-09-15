/* Shared NOVA guest-service demo — published 15 September 2026. */
const NOVA_LOCAL_DEMO = {
  en: {
    keywords: {
      greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
      breakfast: ['breakfast'], checkin: ['check in', 'check-in', 'checkout', 'check out', 'arrival', 'departure'],
      wifi: ['wifi', 'wi-fi', 'internet'], parking: ['parking', 'park'],
      reception: ['reception', 'human', 'staff', 'team', 'employee', 'contact'],
      booking: ['book', 'booking', 'reservation', 'availability', 'room'],
      product: ['what is nova', 'who is nova', 'tell me about nova', 'about nova', 'nova hotel intelligence'],
      capabilities: ['what can you', 'how can you', 'help', 'capabilities'],
      thanks: ['thanks', 'thank you', 'many thanks'],
    },
    responses: {
      greeting: 'Welcome to NOVA Demo Hotel. How may we assist you?',
      breakfast: 'Breakfast at NOVA Demo Hotel is served daily from 7:00 a.m. to 10:00 a.m.',
      checkin: 'Check-in is available from 3:00 p.m.; check-out is until 11:00 a.m.',
      wifi: 'Wi-Fi is available free of charge throughout the hotel. Guests receive the access details at check-in.',
      parking: 'Parking is subject to availability. During a real hotel stay, reception can help check a reservation.',
      reception: 'During a real hotel stay, I would now prepare your request for reception. This website demo does not send a real request.',
      booking: 'This website demo does not check real availability or create bookings. During hotel operation, NOVA assists with the request and involves the hotel team when needed.',
      product: 'NOVA is a digital guest service for hotels. It answers common questions about a stay, supports hotel teams with recurring requests and can prepare approved hotel workflows. This website demo uses sample information and does not make real bookings or forward requests.',
      capabilities: 'I answer typical questions about the stay and hotel services, such as breakfast, check-in, Wi-Fi or parking. This demo uses sample information only.',
      thanks: 'You are welcome. Is there anything else I can help you with in this demo?',
      unknown: 'I do not have confirmed hotel information about that in this demo. I can show you how NOVA prepares a request for the hotel team.',
      unknownAgain: 'I can currently answer demo questions about breakfast, check-in, Wi-Fi, parking, reception, bookings or NOVA itself. Which topic would you like to try?',
    },
  },
  de: {
    keywords: {
      greeting: ['hi', 'hallo', 'guten tag', 'guten morgen', 'guten abend', 'servus'],
      breakfast: ['fruhstuck', 'frühstück'], checkin: ['check-in', 'check in', 'checkout', 'check-out', 'ankunft', 'abreise'],
      wifi: ['wlan', 'wi-fi', 'wifi', 'internet'], parking: ['parkplatz', 'parken', 'garage'],
      reception: ['rezeption', 'mitarbeiter', 'mensch', 'team', 'kontakt', 'jemand'],
      booking: ['buchen', 'buchung', 'reservierung', 'verfugbar', 'verfügbar', 'zimmer'],
      product: ['was ist nova', 'wer ist nova', 'erzahl mir von nova', 'erzähl mir von nova', 'uber nova', 'über nova', 'nova hotel intelligence'],
      capabilities: ['was kannst du', 'was können sie', 'helfen', 'funktionen'],
      thanks: ['danke', 'vielen dank', 'dankeschon', 'dankeschön'],
    },
    responses: {
      greeting: 'Guten Tag und herzlich willkommen im NOVA Demo Hotel. Wie dürfen wir Ihnen behilflich sein?',
      breakfast: 'Das Frühstück im NOVA Demo Hotel wird täglich von 07:00 bis 10:00 Uhr serviert.',
      checkin: 'Der Check-in ist ab 15:00 Uhr möglich, der Check-out bis 11:00 Uhr.',
      wifi: 'WLAN steht im gesamten Hotel kostenfrei zur Verfügung. Die Zugangsdaten erhalten Gäste beim Check-in.',
      parking: 'Parkplätze sind nach Verfügbarkeit verfügbar. Im echten Hotelbetrieb prüft die Rezeption gern eine Reservierung.',
      reception: 'Im echten Hotelbetrieb würde ich Ihr Anliegen jetzt für die Rezeption vorbereiten. Diese Website-Demo versendet keine reale Anfrage.',
      booking: 'Diese Website-Demo prüft keine echte Verfügbarkeit und nimmt keine Buchung vor. Im Hotelbetrieb unterstützt NOVA bei der Anfrage und bezieht bei Bedarf das Hotelteam ein.',
      product: 'NOVA ist der digitale Gästeservice für Hotels. NOVA beantwortet typische Fragen zum Aufenthalt, unterstützt Hotelteams bei wiederkehrenden Anliegen und kann freigegebene Hotelabläufe vorbereiten. Diese Website-Demo verwendet Beispieldaten und führt keine echte Buchung oder Weiterleitung aus.',
      capabilities: 'Ich beantworte typische Fragen zu Aufenthalt und Hotelservice, zum Beispiel zu Frühstück, Check-in, WLAN oder Parkplätzen. In dieser Demo verwende ich ausschließlich Beispieldaten.',
      thanks: 'Sehr gern. Kann ich Ihnen in dieser Demo noch bei einem anderen Thema helfen?',
      unknown: 'Dazu liegen mir in dieser Demo keine bestätigten Hotelinformationen vor. Ich kann Ihnen zeigen, wie NOVA eine Anfrage für das Hotelteam vorbereitet.',
      unknownAgain: 'In dieser Demo kann ich derzeit Fragen zu Frühstück, Check-in, WLAN, Parken, Rezeption, Buchungen oder zu NOVA selbst beantworten. Welches Thema möchten Sie ausprobieren?',
    },
  },
  tr: {
    keywords: {
      greeting: ['merhaba', 'selam', 'gunaydin', 'günaydın', 'iyi aksamlar'],
      breakfast: ['kahvalti', 'kahvaltı'], checkin: ['check-in', 'giris', 'giriş', 'cikis', 'çıkış'],
      wifi: ['wifi', 'wi-fi', 'internet'], parking: ['otopark', 'park'],
      reception: ['resepsiyon', 'personel', 'ekip', 'insan', 'iletisim', 'iletişim'],
      booking: ['rezervasyon', 'musait', 'müsait', 'oda', 'ayirt', 'ayırt'],
      product: ['nova nedir', 'nova ne', 'nova kim', 'nova hakkinda', 'nova hakkında', 'nova hotel intelligence'],
      capabilities: ['ne yapabilir', 'yardim', 'yardım'],
      thanks: ['tesekkurler', 'teşekkürler', 'tesekkur ederim', 'teşekkür ederim', 'sag ol', 'sağ ol'],
    },
    responses: {
      greeting: 'NOVA Demo Hotel’e hoş geldiniz. Size nasıl yardımcı olabiliriz?',
      breakfast: 'NOVA Demo Hotel’de kahvaltı her gün 07.00–10.00 saatleri arasında servis edilir.',
      checkin: 'Giriş saati 15.00’ten itibaren, çıkış saati ise 11.00’e kadardır.',
      wifi: 'Otelin tamamında ücretsiz Wi-Fi mevcuttur. Giriş sırasında erişim bilgileri paylaşılır.',
      parking: 'Otopark müsaitlik durumuna bağlıdır. Gerçek otel hizmetinde resepsiyon rezervasyon kontrolünde yardımcı olabilir.',
      reception: 'Gerçek otel hizmetinde talebinizi resepsiyon için hazırlardım. Bu web sitesi demosu gerçek bir talep göndermez.',
      booking: 'Bu web sitesi demosu gerçek müsaitlik kontrolü veya rezervasyon yapmaz. Otel hizmetinde NOVA talebe yardımcı olur ve gerektiğinde otel ekibini dahil eder.',
      product: 'NOVA, oteller için dijital misafir hizmetidir. Konaklama hakkındaki sık sorulan soruları yanıtlar, otel ekiplerinin tekrarlayan taleplerini yönetmesine yardımcı olur ve onaylanmış otel iş akışlarını hazırlayabilir. Bu web demosu örnek bilgiler kullanır; gerçek rezervasyon veya talep aktarımı yapmaz.',
      capabilities: 'Kahvaltı, giriş, Wi-Fi veya otopark gibi konaklama ve otel hizmetleriyle ilgili tipik soruları yanıtlarım. Bu demo yalnızca örnek bilgiler kullanır.',
      thanks: 'Rica ederim. Bu demoda başka bir konuda yardımcı olabilir miyim?',
      unknown: 'Bu demoda bu konuya ilişkin doğrulanmış otel bilgisi bulunmuyor. NOVA’nın otel ekibi için nasıl talep hazırladığını gösterebilirim.',
      unknownAgain: 'Bu demoda şu anda kahvaltı, giriş, Wi-Fi, otopark, resepsiyon, rezervasyon veya NOVA hakkında soruları yanıtlayabilirim. Hangi konuyu denemek istersiniz?',
    },
  },
  ru: {
    keywords: {
      greeting: ['привет', 'здравствуйте', 'добрый день', 'доброе утро', 'добрый вечер'],
      breakfast: ['завтрак'], checkin: ['заезд', 'выезд', 'регистрация'], wifi: ['wifi', 'wi-fi', 'вайфай', 'интернет'],
      parking: ['парков'], reception: ['ресепш', 'стойк', 'сотрудник', 'человек', 'команд', 'контакт'],
      booking: ['брони', 'номер', 'доступн', 'свободн'], product: ['что такое nova', 'кто такая nova', 'кто такой nova', 'о nova', 'nova hotel intelligence'],
      capabilities: ['что ты умеешь', 'что вы умеете', 'помощ'], thanks: ['спасибо', 'благодарю', 'большое спасибо'],
    },
    responses: {
      greeting: 'Добро пожаловать в NOVA Demo Hotel. Чем мы можем вам помочь?',
      breakfast: 'Завтрак в NOVA Demo Hotel подают ежедневно с 07:00 до 10:00.',
      checkin: 'Заезд возможен с 15:00, выезд — до 11:00.',
      wifi: 'Бесплатный Wi-Fi доступен на всей территории отеля. Данные для входа гости получают при заселении.',
      parking: 'Парковка предоставляется при наличии мест. В реальном отеле стойка регистрации поможет проверить возможность бронирования.',
      reception: 'В реальном отеле я бы подготовила ваше обращение для стойки регистрации. Эта демонстрация на сайте не отправляет реальных запросов.',
      booking: 'Эта демонстрация не проверяет реальную доступность и не оформляет бронирования. В отеле NOVA помогает с запросом и при необходимости подключает сотрудников.',
      product: 'NOVA — цифровой сервис для гостей отелей. Он отвечает на типичные вопросы о проживании, помогает сотрудникам с повторяющимися обращениями и может подготавливать утверждённые рабочие процессы отеля. Эта веб-демонстрация использует примерные данные и не оформляет реальные бронирования и обращения.',
      capabilities: 'Я отвечаю на типичные вопросы о проживании и услугах отеля, например о завтраке, заезде, Wi-Fi или парковке. В демо используются только примерные данные.',
      thanks: 'Пожалуйста. Могу я помочь вам с другим вопросом в этой демонстрации?',
      unknown: 'В этой демонстрации у меня нет подтверждённой информации отеля по этому вопросу. Я могу показать, как NOVA готовит запрос для команды отеля.',
      unknownAgain: 'Сейчас в этой демонстрации я могу ответить о завтраке, заезде, Wi-Fi, парковке, стойке регистрации, бронировании или о самой NOVA. Какую тему вы хотите проверить?',
    },
  },
  id: {
    keywords: {
      greeting: ['halo', 'hai', 'selamat pagi', 'selamat siang', 'selamat malam'], breakfast: ['sarapan'],
      checkin: ['check-in', 'check in', 'check-out', 'checkout', 'masuk', 'keluar'], wifi: ['wifi', 'wi-fi', 'internet'],
      parking: ['parkir'], reception: ['resepsionis', 'staf', 'petugas', 'tim', 'kontak', 'orang'],
      booking: ['pesan', 'pemesanan', 'reservasi', 'kamar', 'tersedia'], product: ['apa itu nova', 'siapa nova', 'tentang nova', 'nova hotel intelligence'],
      capabilities: ['apa yang bisa', 'bantu', 'kemampuan'], thanks: ['terima kasih', 'makasih'],
    },
    responses: {
      greeting: 'Selamat datang di NOVA Demo Hotel. Ada yang dapat kami bantu?',
      breakfast: 'Sarapan di NOVA Demo Hotel disajikan setiap hari pukul 07.00–10.00.',
      checkin: 'Check-in tersedia mulai pukul 15.00; check-out hingga pukul 11.00.',
      wifi: 'Wi-Fi gratis tersedia di seluruh hotel. Tamu menerima detail akses saat check-in.',
      parking: 'Parkir tersedia tergantung ketersediaan. Dalam operasional hotel nyata, resepsionis dapat membantu memeriksa reservasi.',
      reception: 'Dalam operasional hotel nyata, saya akan menyiapkan permintaan Anda untuk resepsionis. Demo situs ini tidak mengirim permintaan nyata.',
      booking: 'Demo situs ini tidak memeriksa ketersediaan nyata atau membuat reservasi. Dalam operasional hotel, NOVA membantu permintaan dan melibatkan tim hotel bila diperlukan.',
      product: 'NOVA adalah layanan tamu digital untuk hotel. NOVA menjawab pertanyaan umum tentang masa inap, membantu tim hotel menangani permintaan berulang, dan dapat menyiapkan alur kerja hotel yang telah disetujui. Demo situs ini menggunakan informasi contoh dan tidak membuat reservasi atau meneruskan permintaan nyata.',
      capabilities: 'Saya menjawab pertanyaan umum tentang masa inap dan layanan hotel, seperti sarapan, check-in, Wi-Fi, atau parkir. Demo ini hanya menggunakan informasi contoh.',
      thanks: 'Sama-sama. Adakah topik lain yang dapat saya bantu dalam demo ini?',
      unknown: 'Dalam demo ini, saya tidak memiliki informasi hotel yang terverifikasi tentang hal tersebut. Saya dapat menunjukkan cara NOVA menyiapkan permintaan untuk tim hotel.',
      unknownAgain: 'Saat ini saya dapat menjawab pertanyaan demo tentang sarapan, check-in, Wi-Fi, parkir, resepsionis, reservasi, atau NOVA. Topik mana yang ingin Anda coba?',
    },
  },
  th: {
    keywords: {
      greeting: ['สวัสดี', 'หวัดดี'], breakfast: ['อาหารเช้า'], checkin: ['เช็กอิน', 'เช็คอิน', 'เช็กเอาต์', 'เช็คเอาท์'],
      wifi: ['wifi', 'wi-fi', 'ไวไฟ', 'อินเทอร์เน็ต'], parking: ['ที่จอดรถ', 'จอดรถ'],
      reception: ['แผนกต้อนรับ', 'พนักงาน', 'เจ้าหน้าที่', 'ทีม', 'ติดต่อ'], booking: ['จอง', 'ห้อง', 'ว่าง'],
      product: ['nova คืออะไร', 'โนวาคืออะไร', 'เกี่ยวกับ nova', 'nova hotel intelligence'],
      capabilities: ['ทำอะไรได้', 'ช่วย', 'ความสามารถ'],
      thanks: ['ขอบคุณ', 'ขอบคุณค่ะ', 'ขอบคุณครับ'],
    },
    responses: {
      greeting: 'ยินดีต้อนรับสู่ NOVA Demo Hotel มีอะไรให้เราช่วยไหมคะ?',
      breakfast: 'NOVA Demo Hotel ให้บริการอาหารเช้าทุกวัน เวลา 07:00–10:00 น.',
      checkin: 'เช็กอินได้ตั้งแต่ 15:00 น. และเช็กเอาต์ได้ถึง 11:00 น.',
      wifi: 'มี Wi-Fi ฟรีทั่วทั้งโรงแรม ผู้เข้าพักจะได้รับข้อมูลการเข้าใช้งานเมื่อเช็กอิน',
      parking: 'ที่จอดรถขึ้นอยู่กับจำนวนที่ว่าง ในการให้บริการจริง แผนกต้อนรับสามารถช่วยตรวจสอบการสำรองที่จอดรถได้',
      reception: 'ในการให้บริการจริง ฉันจะเตรียมคำขอของคุณให้แผนกต้อนรับ เว็บไซต์สาธิตนี้ไม่ได้ส่งคำขอจริง',
      booking: 'เว็บไซต์สาธิตนี้ไม่ได้ตรวจสอบห้องว่างจริงหรือทำการจอง ในการให้บริการของโรงแรม NOVA จะช่วยเรื่องคำขอและประสานทีมโรงแรมเมื่อจำเป็น',
      product: 'NOVA คือบริการดิจิทัลสำหรับผู้เข้าพักในโรงแรม ตอบคำถามทั่วไปเกี่ยวกับการเข้าพัก ช่วยทีมโรงแรมจัดการคำขอที่เกิดขึ้นเป็นประจำ และสามารถเตรียมขั้นตอนงานของโรงแรมที่ได้รับอนุมัติแล้ว เดโมเว็บไซต์นี้ใช้ข้อมูลตัวอย่างและไม่มีการจองหรือส่งต่อคำขอจริง',
      capabilities: 'ฉันตอบคำถามทั่วไปเกี่ยวกับการเข้าพักและบริการของโรงแรม เช่น อาหารเช้า เช็กอิน Wi-Fi หรือที่จอดรถ การสาธิตนี้ใช้ข้อมูลตัวอย่างเท่านั้น',
      thanks: 'ยินดีค่ะ มีเรื่องอื่นที่ให้ช่วยในเดโมนี้ไหมคะ?',
      unknown: 'การสาธิตนี้ไม่มีข้อมูลโรงแรมที่ยืนยันแล้วในเรื่องดังกล่าว ฉันสามารถแสดงวิธีที่ NOVA เตรียมคำขอสำหรับทีมโรงแรมได้',
      unknownAgain: 'ขณะนี้เดโมตอบได้เกี่ยวกับอาหารเช้า เช็กอิน Wi-Fi ที่จอดรถ แผนกต้อนรับ การจอง หรือ NOVA คุณอยากลองหัวข้อใดคะ?',
    },
  },
  ban: {
    keywords: {
      greeting: ['halo', 'hai', 'rahajeng'], breakfast: ['sarapan'], checkin: ['check-in', 'check in', 'check-out', 'checkout'],
      wifi: ['wifi', 'wi-fi', 'internet'], parking: ['parkir'], reception: ['resepsionis', 'staf', 'tim', 'kontak'],
      booking: ['pesan', 'reservasi', 'kamar'], product: ['napi punika nova', 'nova punika napi', 'indik nova', 'nova hotel intelligence'],
      capabilities: ['napi sane dados', 'tulung'], thanks: ['matur suksma', 'suksma'],
    },
    responses: {
      greeting: 'Rahajeng rauh ring NOVA Demo Hotel. Wenten sane prasida titiang bantu?',
      breakfast: 'Sarapan ring NOVA Demo Hotel kaatur saban rahina jam 07.00–10.00.',
      checkin: 'Check-in ngawit jam 15.00 lan check-out nganti jam 11.00.',
      wifi: 'Wi-Fi gratis sayaga ring sajebag hotel. Tamiu ngamolihang informasi akses rikala check-in.',
      parking: 'Parkir manut ketersediaan. Ring layanan hotel sane nyata, resepsionis prasida nulung mriksa reservasi.',
      reception: 'Ring layanan hotel sane nyata, titiang jagi nyiagayang panyuun ragane majeng resepsionis. Demo situs puniki nenten ngirim panyuun nyata.',
      booking: 'Demo situs puniki nenten mriksa ketersediaan nyata utawi makarya reservasi. Ring operasional hotel, NOVA nulung panyuun miwah ngelibatang tim hotel yening kaaptiang.',
      product: 'NOVA inggih punika layanan digital majeng tamiu hotel. NOVA ngawales pitaken umum indik nginep, nulung tim hotel ring panyuun sane mawali-wali, miwah prasida nyiagayang alur kerja hotel sane sampun kasetujonin. Demo situs puniki nganggen informasi conto lan nenten makarya reservasi utawi ngirim panyuun nyata.',
      capabilities: 'Titiang ngawales pitaken umum indik nginep miwah layanan hotel, sakadi sarapan, check-in, Wi-Fi, utawi parkir. Demo puniki wantah nganggen informasi conto.',
      thanks: 'Suksma mawali. Wenten topik lianan sane prasida titiang bantu ring demo puniki?',
      unknown: 'Ring demo puniki nenten wenten informasi hotel sane sampun kapastikayang indik punika. Titiang prasida nyihnayang cara NOVA nyiagayang panyuun majeng tim hotel.',
      unknownAgain: 'Mangkin demo puniki prasida ngawales indik sarapan, check-in, Wi-Fi, parkir, resepsionis, reservasi, utawi NOVA. Topik napi sane jagi ragane coba?',
    },
  },
  ka: {
    keywords: {
      greeting: ['გამარჯობა', 'სალამი', 'დილა მშვიდობისა', 'საღამო მშვიდობისა'], breakfast: ['საუზმ'],
      checkin: ['check-in', 'check in', 'check-out', 'checkout', 'შესახლ', 'გასახლ'], wifi: ['wifi', 'wi-fi', 'ინტერნეტ'],
      parking: ['პარკინგ'], reception: ['რეცეფცია', 'თანამშრომელ', 'ადამიან', 'გუნდი', 'კონტაქტ'],
      booking: ['დაჯავშ', 'ოთახ', 'ხელმისაწვდომ'], product: ['რა არის nova', 'ვინ არის nova', 'nova-ს შესახებ', 'ნოვას შესახებ', 'nova hotel intelligence'],
      capabilities: ['რა შეგიძლია', 'დახმარ'], thanks: ['მადლობა', 'დიდი მადლობა'],
    },
    responses: {
      greeting: 'კეთილი იყოს თქვენი მობრძანება NOVA Demo Hotel-ში. როგორ შეგვიძლია დაგეხმაროთ?',
      breakfast: 'NOVA Demo Hotel-ში საუზმე ყოველდღე 07:00-დან 10:00 საათამდეა.',
      checkin: 'შესახლება შესაძლებელია 15:00 საათიდან, გასახლება — 11:00 საათამდე.',
      wifi: 'უფასო Wi-Fi ხელმისაწვდომია მთელ სასტუმროში. სტუმრები წვდომის მონაცემებს შესახლებისას იღებენ.',
      parking: 'პარკინგი ხელმისაწვდომია თავისუფალი ადგილების მიხედვით. რეალურ სასტუმროში რეცეფცია დაჯავშნის შემოწმებაში დაგეხმარებათ.',
      reception: 'რეალურ სასტუმროში თქვენს მოთხოვნას რეცეფციისთვის მოვამზადებდი. ეს ვებდემო რეალურ მოთხოვნას არ აგზავნის.',
      booking: 'ეს ვებდემო რეალურ ხელმისაწვდომობას არ ამოწმებს და ჯავშანს არ ქმნის. სასტუმროში NOVA მოთხოვნაში გეხმარებათ და საჭიროებისას სასტუმროს გუნდს რთავს.',
      product: 'NOVA სასტუმროებისთვის განკუთვნილი სტუმრების ციფრული მომსახურებაა. ის პასუხობს განთავსების შესახებ გავრცელებულ კითხვებს, ეხმარება სასტუმროს გუნდს განმეორებით მოთხოვნებში და შეუძლია დამტკიცებული სამუშაო პროცესების მომზადება. ეს ვებდემო იყენებს მაგალითის მონაცემებს და რეალურ ჯავშანს ან მოთხოვნის გადაგზავნას არ ასრულებს.',
      capabilities: 'მე ვპასუხობ ტიპურ კითხვებს განთავსებისა და სასტუმროს სერვისების შესახებ, მაგალითად საუზმეზე, შესახლებაზე, Wi-Fi-ზე ან პარკინგზე. ეს დემო მხოლოდ მაგალითის მონაცემებს იყენებს.',
      thanks: 'არაფრის. შემიძლია ამ დემოში სხვა საკითხშიც დაგეხმაროთ?',
      unknown: 'ამ დემოში ამ საკითხზე სასტუმროს დადასტურებული ინფორმაცია არ მაქვს. შემიძლია გაჩვენოთ, როგორ ამზადებს NOVA მოთხოვნას სასტუმროს გუნდისთვის.',
      unknownAgain: 'ამჟამად დემოში შემიძლია ვუპასუხო საუზმის, შესახლების, Wi-Fi-ის, პარკინგის, რეცეფციის, ჯავშნის ან თავად NOVA-ს შესახებ კითხვებს. რომელი თემის გამოცდა გსურთ?',
    },
  },
};

(() => {
  const root = document.querySelector('[data-nova-site-chat]');
  const toggle = document.querySelector('[data-nova-site-chat-toggle]');
  const dialog = document.getElementById('novaSiteChatDialog');
  const close = document.getElementById('novaSiteChatClose');
  const messages = document.getElementById('novaSiteChatMessages');
  const form = document.getElementById('novaSiteChatForm');
  const input = document.getElementById('novaSiteChatInput');
  const send = document.getElementById('novaSiteChatSend');
  const status = document.getElementById('novaSiteChatStatus');
  const quickPrompts = Array.from(document.querySelectorAll('[data-nova-chat-prompt]'));
  if (!root || !toggle || !dialog || !close || !messages || !form || !input || !send || !status) return;

  const endpoint = 'https://n8n.leolan.net/webhook/nova-demo-chat-v2';
  const maxMessageChars = 800;
  const maxHistoryItems = 8;
  const maxHistoryItemChars = 800;
  const maxHistoryTotalChars = 4800;
  const packageTerms = new Set(['package', 'packages', 'paket', 'pakete', 'paketen', 'modul', 'module', 'modules', 'book', 'booking', 'buchen', 'buchung', 'onboarding', 'пакет', 'пакеты', 'бронирование', 'reservasi', 'แพ็กเกจ', 'จอง', 'პაკეტ', 'დაჯავშნა']);
  const supportedLanguage = root.dataset.chatLang || 'en';
  const lang = Object.prototype.hasOwnProperty.call(NOVA_LOCAL_DEMO, supportedLanguage) ? supportedLanguage : 'en';
  let history = [];
  let greeted = false;
  let busy = false;
  let remoteRetryAfter = 0;
  let previousFocus = null;

  function normalize(value) {
    return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function includesAny(value, terms) {
    return terms.some(term => value.includes(normalize(term)));
  }

  function localReply(value) {
    const copy = NOVA_LOCAL_DEMO[lang];
    const normalized = normalize(value);
    const compact = normalized.replace(/[!?.,;:]/g, '').trim();
    if (copy.keywords.greeting.some(term => compact === normalize(term))) return copy.responses.greeting;
    if (includesAny(normalized, copy.keywords.breakfast)) return copy.responses.breakfast;
    if (includesAny(normalized, copy.keywords.checkin)) return copy.responses.checkin;
    if (includesAny(normalized, copy.keywords.wifi)) return copy.responses.wifi;
    if (includesAny(normalized, copy.keywords.parking)) return copy.responses.parking;
    if (includesAny(normalized, copy.keywords.reception)) return copy.responses.reception;
    if (includesAny(normalized, copy.keywords.booking)) return copy.responses.booking;
    if (includesAny(normalized, copy.keywords.product)) return copy.responses.product;
    if (includesAny(normalized, copy.keywords.capabilities)) return copy.responses.capabilities;
    if (copy.keywords.thanks.some(term => compact === normalize(term))) return copy.responses.thanks;
    const lastReply = [...history].reverse().find(item => item.role === 'assistant')?.content;
    return lastReply === copy.responses.unknown ? copy.responses.unknownAgain : copy.responses.unknown;
  }

  const heroControl = document.querySelector('.hero-media-control');
  const footerLanguages = document.querySelector('.nova-site-footer__languages');
  const collisionTargets = [heroControl, footerLanguages].filter(Boolean);
  const positionToggle = () => {
    const width = toggle.offsetWidth;
    const height = toggle.offsetHeight;
    const edge = innerWidth <= 600 ? 16 : 20;
    const gap = 12;
    const candidate = {
      left: innerWidth - edge - width,
      right: innerWidth - edge,
      top: innerHeight - edge - height,
      bottom: innerHeight - edge,
    };
    toggle.style.removeProperty('--nova-site-chat-right');
    toggle.style.removeProperty('--nova-site-chat-bottom');
    const collisions = collisionTargets
      .map(target => target.getBoundingClientRect())
      .filter(control => {
        const visible = control.bottom > 0 && control.top < innerHeight && control.right > 0 && control.left < innerWidth;
        return visible && candidate.left < control.right + gap && candidate.right > control.left - gap && candidate.top < control.bottom + gap && candidate.bottom > control.top - gap;
      });
    if (!collisions.length) return;
    const firstTop = Math.min(...collisions.map(control => control.top));
    toggle.style.setProperty('--nova-site-chat-bottom', `${Math.ceil(innerHeight - firstTop + gap)}px`);
  };
  if (collisionTargets.length) {
    let positioningFrame = 0;
    const schedulePosition = () => {
      cancelAnimationFrame(positioningFrame);
      positioningFrame = requestAnimationFrame(positionToggle);
    };
    addEventListener('resize', schedulePosition);
    addEventListener('scroll', schedulePosition, {passive: true});
    window.visualViewport?.addEventListener('resize', schedulePosition);
    window.visualViewport?.addEventListener('scroll', schedulePosition, {passive: true});
    addEventListener('load', schedulePosition, {once: true});
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedulePosition);
      collisionTargets.forEach(target => observer.observe(target));
    }
    if (heroControl) new MutationObserver(schedulePosition).observe(heroControl, {attributes: true, childList: true, characterData: true, subtree: true});
    document.fonts?.ready.then(schedulePosition);
    schedulePosition();
  }

  const isOpen = () => !root.hidden;
  const isMobile = () => window.matchMedia('(max-width:600px)').matches;
  const focusWithoutScroll = element => {
    try { element.focus({preventScroll: true}); } catch (_error) { element.focus(); }
  };
  const focusable = () => Array.from(dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  const timestamp = () => {
    try {
      return new Intl.DateTimeFormat(lang, {hour: '2-digit', minute: '2-digit'}).format(new Date());
    } catch (_error) {
      return new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit'}).format(new Date());
    }
  };
  const scrollMessages = () => {
    messages.scrollTop = messages.scrollHeight;
  };
  const shouldShowPackages = value => {
    const tokens = normalize(value).split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
    return tokens.some(token => packageTerms.has(token));
  };
  const appendMessage = (value, sender, allowPackageLink = true, source = '') => {
    const message = document.createElement('div');
    message.className = `nova-site-chat__message${sender === 'user' ? ' nova-site-chat__message--user' : ''}`;
    if (source) message.dataset.source = source;
    const text = document.createElement('span');
    text.textContent = value;
    message.append(text);
    if (sender === 'bot' && allowPackageLink && shouldShowPackages(value)) {
      const link = document.createElement('a');
      link.className = 'nova-site-chat__package-link';
      link.href = root.dataset.packageHref || '/#pricing';
      link.textContent = `📦 ${root.dataset.packageLabel || 'View packages'}`;
      message.append(link);
    }
    const time = document.createElement('time');
    time.dateTime = new Date().toISOString();
    time.textContent = timestamp();
    message.append(time);
    messages.append(message);
    scrollMessages();
  };
  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'nova-site-chat__message nova-site-chat__typing';
    typing.id = 'novaSiteChatTyping';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', root.dataset.typingLabel || 'NOVA is typing…');
    for (let index = 0; index < 3; index += 1) typing.append(document.createElement('i'));
    messages.append(typing);
    scrollMessages();
  };
  const hideTyping = () => document.getElementById('novaSiteChatTyping')?.remove();
  const setBusy = value => {
    busy = value;
    form.setAttribute('aria-busy', String(value));
    input.readOnly = value;
    input.setAttribute('aria-disabled', String(value));
    send.disabled = value || !input.value.trim();
    quickPrompts.forEach(button => { button.disabled = value; });
  };
  const setStatus = mode => {
    const label = mode === 'live' ? root.dataset.statusLive : mode === 'example' ? root.dataset.statusExample : root.dataset.statusReady;
    root.dataset.chatMode = mode;
    status.textContent = label || '';
  };
  const remember = (message, reply) => {
    history.push(
      {role: 'user', content: message.slice(0, maxHistoryItemChars)},
      {role: 'assistant', content: reply.slice(0, maxHistoryItemChars)},
    );
    if (history.length > maxHistoryItems) history = history.slice(-maxHistoryItems);
    while (history.length > 2 && history.reduce((total, item) => total + item.content.length, 0) > maxHistoryTotalChars) {
      history = history.slice(2);
    }
  };
  const exampleResult = message => {
    const reply = localReply(message);
    remember(message, reply);
    setStatus('example');
    return {reply, source: 'example'};
  };
  const requestReply = async message => {
    if (Date.now() < remoteRetryAfter) return exampleResult(message);
    if (remoteRetryAfter) setStatus('ready');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5500);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        cache: 'no-store',
        body: JSON.stringify({message, moduleKey: 'hotel-demo', history, lang}),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      const data = await response.json();
      const rawReply = data && (data.reply ?? data.message);
      if (typeof rawReply !== 'string' || !rawReply.trim() || rawReply.length > 12000) throw new Error('INVALID_REPLY');
      const reply = rawReply.trim();
      remember(message, reply);
      setStatus('live');
      return {reply, source: 'live'};
    } catch (error) {
      remoteRetryAfter = Date.now() + 60000;
      const reason = error instanceof Error ? error.name === 'AbortError' ? 'TIMEOUT' : error.message : 'REQUEST_FAILED';
      console.warn('[NOVA demo] Live response unavailable; example mode enabled.', reason);
      return exampleResult(message);
    } finally {
      window.clearTimeout(timeout);
    }
  };
  const fetchAndAppend = async (message, restoreInputFocus) => {
    if (busy) return;
    setBusy(true);
    showTyping();
    try {
      const result = await requestReply(message);
      appendMessage(result.reply, 'bot', result.source === 'live', result.source);
    } finally {
      hideTyping();
      setBusy(false);
      if (isOpen() && restoreInputFocus) focusWithoutScroll(input);
    }
  };
  const submitValue = (value, restoreInputFocus = true) => {
    const message = value.trim().slice(0, maxMessageChars);
    if (!message || busy) return;
    appendMessage(message, 'user', false);
    input.value = '';
    fetchAndAppend(message, restoreInputFocus);
  };
  const openChat = () => {
    if (isOpen()) return;
    previousFocus = document.activeElement;
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    toggle.hidden = true;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nova-site-chat-open');
    focusWithoutScroll(isMobile() ? dialog : input);
    if (!greeted) {
      greeted = true;
      appendMessage(root.dataset.defaultReply || NOVA_LOCAL_DEMO[lang].responses.greeting, 'bot', false, 'local');
    }
  };
  const closeChat = () => {
    if (!isOpen()) return;
    toggle.hidden = false;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nova-site-chat-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    else toggle.focus();
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
  };

  setStatus('ready');
  send.disabled = true;
  toggle.addEventListener('click', openChat);
  close.addEventListener('click', closeChat);
  input.addEventListener('input', () => { send.disabled = busy || !input.value.trim(); });
  quickPrompts.forEach(button => button.addEventListener('click', () => submitValue(button.dataset.novaChatPrompt || button.textContent || '', false)));
  root.addEventListener('click', event => {
    if (event.target === root) closeChat();
  });
  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeChat();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (!dialog.contains(document.activeElement) || !items.includes(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitValue(input.value);
  });
})();
