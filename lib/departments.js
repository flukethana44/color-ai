export const DEPARTMENTS = [
  {
    id:'multimedia', name:'🎬 สื่อดิจิทัลและคอนเทนต์', tagline:'งานดิจิทัล หน้าจอ และสื่อโต้ตอบ',
    style:['Digital','Futuristic','Interactive','Modern'],
    subjects:[
      {label:'UI/UX', icon:'browser'},{label:'Website', icon:'browser'},{label:'Application', icon:'mobile'},
      {label:'Motion Graphic', icon:'play'},
    ],
    shapes:['Grid','Interface Frame','Geometric Elements','Particles'],
    objects:['Screen','Smartphone','Computer','UI Components'],
    shapesInferred:false,
  },
  {
    id:'interior', name:'🏠 ตกแต่งบ้านและภายใน', tagline:'พื้นที่ วัสดุ และบรรยากาศของห้อง',
    style:['Modern','Minimal','Japandi','Scandinavian'],
    subjects:[
      {label:'Interior', icon:'wall'},{label:'Room', icon:'wall'},{label:'House', icon:'wall'},
      {label:'Furniture', icon:'chair'},
    ],
    shapes:['ปริมาตรทรงสี่เหลี่ยม','เส้นสายเรียบง่าย','ผิวสัมผัสธรรมชาติ','องค์ประกอบโค้งมนแบบ Japandi'],
    objects:['Chair','Sofa','Table','Lamp'],
    shapesInferred:false,
  },
  {
    id:'finearts', name:'🎨 ศิลปะและภาพวาด', tagline:'งานศิลปะ การแสดงออก และองค์ประกอบภาพ',
    style:['Artistic','Expressive','Abstract','Experimental'],
    subjects:[
      {label:'Painting', icon:'brush'},{label:'Drawing', icon:'canvas'},{label:'Sculpture', icon:'blob'},
      {label:'Illustration', icon:'brush'},
    ],
    shapes:['ฝีแปรงอิสระ','ทรงออร์แกนิก','พื้นผิวไม่สมมาตร','การซ้อนทับของชั้นสี'],
    objects:['Canvas','Paint Brush','Palette','Sculpture'],
    shapesInferred:false,
  },
  {
    id:'comdesign', name:'🖼️ กราฟิกและการออกแบบ', tagline:'การสื่อสารด้วยภาพ ตัวอักษร และแบรนด์',
    style:['Graphic','Modern','Bold','Minimal'],
    subjects:[
      {label:'Poster', icon:'poster'},{label:'Typography', icon:'type'},{label:'Logo', icon:'logo'},
      {label:'Branding', icon:'logo'},
    ],
    shapes:['กริดจัดวางที่ชัดเจน','บล็อกสีเรียบ','ตัวอักษรเป็นองค์ประกอบหลัก','เส้นแบ่งสัดส่วน'],
    objects:['Poster','Logo','Package','Brand Identity'],
    shapesInferred:false,
  },
  {
    id:'architecture', name:'🏢 สถาปัตยกรรม', tagline:'อาคาร โครงสร้าง และการนำเสนอทางสถาปัตยกรรม',
    style:['Geometric','Modern','Architectural','Minimal'],
    subjects:[
      {label:'House', icon:'wall'},{label:'Building', icon:'building'},{label:'Floor Plan', icon:'blueprint'},
      {label:'Facade', icon:'building'},
    ],
    shapes:['เส้นโครงสร้างแนวตั้ง-นอน','บล็อกทรงเรขาคณิตเรียบ','ระนาบซ้อนชั้น','สัดส่วนแบบกริดสถาปัตย์'],
    objects:['Building','House','Blueprint','Facade'],
    shapesInferred:true,
  },
  {
    id:'urban', name:'🌆 เมืองและพื้นที่', tagline:'ระบบเมือง พื้นที่สาธารณะ และการวางผัง',
    style:['Urban','Functional','Systematic','Geographic'],
    subjects:[
      {label:'City Planning', icon:'city'},{label:'Master Plan', icon:'map'},{label:'Road Network', icon:'road'},
      {label:'Public Space', icon:'park'},
    ],
    shapes:['โครงข่ายเส้นถนน','บล็อกผังพื้นที่','สัญลักษณ์แผนที่','โซนสีตามการใช้ที่ดิน'],
    objects:['City','Road','Map','Public Space'],
    shapesInferred:true,
  },
  {
    id:'creative', name:'🎨 นวัตกรรมและออกแบบสร้างสรรค์', tagline:'ผลิตภัณฑ์ ต้นแบบ และงานออกแบบเชิงทดลอง',
    style:['Creative','Experimental','Innovative','Conceptual'],
    subjects:[
      {label:'Product Design', icon:'product'},{label:'Concept Design', icon:'spark'},{label:'Prototype', icon:'product'},
      {label:'Installation', icon:'install'},
    ],
    shapes:['ทรงอิสระนอกกรอบเดิม','ชิ้นส่วนประกอบทดลอง','พื้นผิวผสมวัสดุ','องค์ประกอบต้นแบบ'],
    objects:['Product','Prototype','Creative Object','Installation'],
    shapesInferred:true,
  },
];
