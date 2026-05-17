"""
Complete 78-card Tarot dataset.
card_id format:
  Major Arcana  → "major_{number}"  e.g. "major_0"
  Minor Arcana  → "{suit}_{rank}"   e.g. "cups_ace", "wands_7", "swords_page"
image path convention (frontend assets/cards/):
  Major  → major/major_{number}.jpg
  Minor  → {suit}/{suit}_{rank}.jpg
"""

MAJOR_ARCANA = [
    {"card_id": "major_0",  "name": "The Fool",           "number": "0",    "suit": "major",
     "keywords_up": ["Beginnings","Freedom","Innocence","Leap of faith"],
     "keywords_rev": ["Recklessness","Risk","Naivety","Distraction"],
     "meaning_up": "การเดินทางใหม่เริ่มต้นขึ้น จงก้าวออกไปด้วยหัวใจที่บริสุทธิ์และไว้วางใจในจักรวาล",
     "meaning_rev": "ความประมาทกำลังบดบังเส้นทาง ใช้ความระมัดระวังก่อนจะก้าวไป"},

    {"card_id": "major_1",  "name": "The Magician",       "number": "I",    "suit": "major",
     "keywords_up": ["Power","Skill","Action","Resourcefulness"],
     "keywords_rev": ["Manipulation","Untapped potential","Deception"],
     "meaning_up": "เครื่องมือทุกอย่างอยู่ในมือของท่านแล้ว จงใช้พลังแห่งเจตจำนงเปลี่ยนความคิดให้กลายเป็นความจริง",
     "meaning_rev": "พลังที่ถูกนำไปใช้ในทางผิด ตรวจสอบว่าท่านกำลังถูกหลอกหรือกำลังหลอกตัวเอง"},

    {"card_id": "major_2",  "name": "The High Priestess", "number": "II",   "suit": "major",
     "keywords_up": ["Intuition","Subconscious","Wisdom","Mystery"],
     "keywords_rev": ["Secrets","Disconnection","Withdrawal"],
     "meaning_up": "ม่านระหว่างโลกบางลง จงเชื่อในสิ่งที่ความฝันกระซิบบอก ความรู้ศักดิ์สิทธิ์รอท่านอยู่ในความเงียบ",
     "meaning_rev": "ความลับที่เก็บไว้นานเกินไปกลายเป็นพิษ มีสิ่งใดที่ท่านปฏิเสธที่จะมองเห็น?"},

    {"card_id": "major_3",  "name": "The Empress",        "number": "III",  "suit": "major",
     "keywords_up": ["Abundance","Nurturing","Beauty","Nature"],
     "keywords_rev": ["Dependence","Smothering","Emptiness"],
     "meaning_up": "ธรรมชาติชื่นชมยินดีในการปรากฏตัวของท่าน นี่คือช่วงเวลาแห่งการเติบโต จงหล่อเลี้ยงสิ่งที่ท่านรัก",
     "meaning_rev": "ความคิดสร้างสรรค์ถูกกักขัง ท่านกำลังละเลยความต้องการของตัวเองหรือไม่?"},

    {"card_id": "major_4",  "name": "The Emperor",        "number": "IV",   "suit": "major",
     "keywords_up": ["Authority","Structure","Control","Leadership"],
     "keywords_rev": ["Tyranny","Rigidity","Coldness"],
     "meaning_up": "จงยืนหยัดในอำนาจอธิปไตยของท่าน สร้างด้วยวินัยและความมองการณ์ไกล รากฐานที่วางในวันนี้จะค้ำจุนอาณาจักร",
     "meaning_rev": "ความแข็งกร้าวกลายเป็นกรงขัง ตรวจสอบว่าการควบคุมได้กลายเป็นการครอบงำแล้วหรือไม่"},

    {"card_id": "major_5",  "name": "The Hierophant",     "number": "V",    "suit": "major",
     "keywords_up": ["Tradition","Conformity","Morality","Ethics"],
     "keywords_rev": ["Rebellion","Subversiveness","New approaches"],
     "meaning_up": "แสวงหาปัญญาผ่านเส้นทางที่ได้รับการพิสูจน์แล้ว ครูหรือสถาบันถือกุญแจที่ท่านกำลังค้นหา",
     "meaning_rev": "ขนบธรรมเนียมบั่นทอนจิตวิญญาณ อาจถึงเวลาที่จะสร้างความจริงทางจิตวิญญาณของตัวเอง"},

    {"card_id": "major_6",  "name": "The Lovers",         "number": "VI",   "suit": "major",
     "keywords_up": ["Love","Harmony","Choices","Alignment"],
     "keywords_rev": ["Disharmony","Imbalance","Misalignment"],
     "meaning_up": "การรวมตัวอันศักดิ์สิทธิ์กำลังโบกมือเรียก จงเลือกด้วยหัวใจที่สอดคล้องกับความจริงอันลึกซึ้งที่สุดของท่าน",
     "meaning_rev": "ความขัดแย้งทำลายสิ่งที่เคยเป็นหนึ่ง ตรวจสอบค่านิยมที่ไม่ลงรอยกันในความสัมพันธ์"},

    {"card_id": "major_7",  "name": "The Chariot",        "number": "VII",  "suit": "major",
     "keywords_up": ["Control","Willpower","Victory","Determination"],
     "keywords_rev": ["Aggression","Lack of direction","No control"],
     "meaning_up": "จงควบคุมพลังที่ขัดแย้งและมุ่งหน้าต่อไป ชัยชนะเป็นของผู้ที่ปฏิเสธที่จะยอมแพ้",
     "meaning_rev": "รถศึกวิ่งอย่างบ้าคลั่งโดยไม่มีทิศทาง กลับมาโฟกัสก่อนที่แรงผลักดันจะกลายเป็นการทำลายล้าง"},

    {"card_id": "major_8",  "name": "Strength",           "number": "VIII", "suit": "major",
     "keywords_up": ["Strength","Courage","Patience","Compassion"],
     "keywords_rev": ["Self-doubt","Weakness","Insecurity"],
     "meaning_up": "ความเข้มแข็งที่แท้จริงคือการเป็นนายอย่างนุ่มนวล จงเผชิญความกลัวด้วยความเมตตา สิงห์ภายในยอมต่อความรัก",
     "meaning_rev": "ความสงสัยในตัวเองครอบงำ จงฟื้นฟูอธิปไตยภายในด้วยความอดทน"},

    {"card_id": "major_9",  "name": "The Hermit",         "number": "IX",   "suit": "major",
     "keywords_up": ["Solitude","Introspection","Guidance","Wisdom"],
     "keywords_rev": ["Isolation","Loneliness","Withdrawal"],
     "meaning_up": "ถอยออกจากเสียงรบกวน ในความโดดเดี่ยว แสงปัญญาส่องทางที่มีแค่ท่านเท่านั้นที่ต้องเดิน",
     "meaning_rev": "การโดดเดี่ยวหมักหมมกลายเป็นความเดียวดาย ถึงเวลาปรากฏตัวอีกครั้งและแบ่งปันปัญญา"},

    {"card_id": "major_10", "name": "Wheel of Fortune",   "number": "X",    "suit": "major",
     "keywords_up": ["Luck","Karma","Destiny","Cycles"],
     "keywords_rev": ["Bad luck","Resistance","Disorder"],
     "meaning_up": "วงล้อใหญ่หมุนเข้าข้างท่าน โชคชะตาสมคบกันนำการเปลี่ยนแปลงที่รอคอยมานาน จงโอบรับกระแสที่กลับมา",
     "meaning_rev": "วงล้อหมุนขัดต่อท่านชั่วคราว การต่อต้านการเปลี่ยนแปลงเพียงยืดการต่อสู้ออกไป"},

    {"card_id": "major_11", "name": "Justice",            "number": "XI",   "suit": "major",
     "keywords_up": ["Justice","Truth","Cause & Effect","Law"],
     "keywords_rev": ["Unfairness","Dishonesty","Lack of accountability"],
     "meaning_up": "ความจริงตัดอย่างสะอาด จงเผชิญผลของการกระทำด้วยความซื่อสัตย์ ตาชั่งหาความสมดุลเสมอ",
     "meaning_rev": "ความอยุติธรรมเน่าเปื่อยในเงามืด ตรวจสอบว่าท่านหลีกเลี่ยงความรับผิดชอบหรือไม่"},

    {"card_id": "major_12", "name": "The Hanged Man",     "number": "XII",  "suit": "major",
     "keywords_up": ["Pause","Surrender","Letting go","New perspective"],
     "keywords_rev": ["Delays","Resistance","Stalling"],
     "meaning_up": "จงยอมแพ้ต่อแรงกระตุ้นที่อยากกระทำ ในการหยุดชั่วคราว มุมมองใหม่จะเปลี่ยนแปลงทุกสิ่งที่ท่านคิดว่ารู้",
     "meaning_rev": "ท่านชะลอสิ่งที่หลีกเลี่ยงไม่ได้ ปล่อยวางสิ่งที่ยึดไว้และยอมให้การเปลี่ยนแปลงเกิดขึ้น"},

    {"card_id": "major_13", "name": "Death",              "number": "XIII", "suit": "major",
     "keywords_up": ["Endings","Change","Transformation","Transition"],
     "keywords_rev": ["Resistance to change","Inability to move on"],
     "meaning_up": "การสิ้นสุดนำมาซึ่งการเกิดใหม่อย่างลึกซึ้ง จงปล่อยสิ่งเก่าด้วยความงดงาม สิ่งที่ตายที่นี่จะหล่อเลี้ยงชีวิตใหม่",
     "meaning_rev": "ท่านต่อต้านการสิ้นสุดที่หลีกเลี่ยงไม่ได้ การยึดติดกับสิ่งที่ผ่านไปแล้วยืดความเจ็บปวด"},

    {"card_id": "major_14", "name": "Temperance",         "number": "XIV",  "suit": "major",
     "keywords_up": ["Balance","Moderation","Purpose","Alchemy"],
     "keywords_rev": ["Imbalance","Excess","Lack of long-term vision"],
     "meaning_up": "ผสมผสานทุกองค์ประกอบด้วยความอดทนอันศักดิ์สิทธิ์ ความสามัคคีไม่ได้อยู่ในความสุดขั้วแต่อยู่ในศิลปะแห่งการผสม",
     "meaning_rev": "ความไม่สมดุลทำให้รากฐานสั่นคลอน แสวงหาทางสายกลางก่อนที่ความเกินพอดีจะครอบงำท่าน"},

    {"card_id": "major_15", "name": "The Devil",          "number": "XV",   "suit": "major",
     "keywords_up": ["Shadow self","Attachment","Addiction","Liberation"],
     "keywords_rev": ["Detachment","Breaking free","Power reclaimed"],
     "meaning_up": "ตั้งชื่อโซ่ตรวนที่ผูกมัดท่าน สิ่งที่ดูเหมือนการจำคุกมักเป็นภาพลวงตาที่ท่านเลือกได้ว่าจะปล่อยวาง",
     "meaning_rev": "คาถาแตกสลาย การปลดปล่อยอยู่ใกล้แค่เอื้อมเมื่อท่านมองเห็นสิ่งนั้นตามความเป็นจริง"},

    {"card_id": "major_16", "name": "The Tower",          "number": "XVI",  "suit": "major",
     "keywords_up": ["Sudden change","Upheaval","Chaos","Revelation"],
     "keywords_rev": ["Fear of change","Avoiding disaster","Delaying inevitable"],
     "meaning_up": "สายฟ้าฟาดรากฐานเท็จ สิ่งที่พังทลายไม่เคยมั่นคงจริงๆ ในซากปรักหักพังมีอิสรภาพอันศักดิ์สิทธิ์",
     "meaning_rev": "ท่านหวุดหวิดหลีกเลี่ยงหายนะหรือต่อต้านการทำลายล้างที่จำเป็น ในที่สุดหอคอยต้องล้ม"},

    {"card_id": "major_17", "name": "The Star",           "number": "XVII", "suit": "major",
     "keywords_up": ["Hope","Faith","Renewal","Inspiration"],
     "keywords_rev": ["Despair","Lack of faith","Discouragement"],
     "meaning_up": "หลังพายุ ดาวปรากฏ ความหวังฟื้นขึ้นเหมือนน้ำค้างยามเช้า จงเทของประทานให้อย่างเสรีและไว้วางใจจักรวาล",
     "meaning_rev": "ความสิ้นหวังปกคลุมแสงสว่างภายใน กลับมาเชื่อมกับความหวังที่ยังคงระยิบอยู่ใต้ความสงสัย"},

    {"card_id": "major_18", "name": "The Moon",           "number": "XVIII","suit": "major",
     "keywords_up": ["Illusion","Fear","Subconscious","Dreams"],
     "keywords_rev": ["Release of fear","Repressed emotion","Confusion"],
     "meaning_up": "เส้นทางใต้แสงจันทร์ไม่ได้เป็นอย่างที่เห็น จงเชื่อสัญชาตญาณผ่านหมอกแห่งภาพลวงตาและความกลัว",
     "meaning_rev": "ความมืดสว่างขึ้น ภาพลวงตาสลายตัวเมื่อความกลัวที่ถูกกดทับผุดขึ้นมาและปล่อยอำนาจของมัน"},

    {"card_id": "major_19", "name": "The Sun",            "number": "XIX",  "suit": "major",
     "keywords_up": ["Joy","Success","Positivity","Vitality"],
     "keywords_rev": ["Inner child","Feeling down","Overly optimistic"],
     "meaning_up": "ดวงอาทิตย์ส่องแสงเป็นใจท่าน ความสุข ความชัดเจน และความสำเร็จแผ่ออกมาจากท่าน จงเฉลิมฉลองอย่างเต็มที่",
     "meaning_rev": "แสงสว่างภายในสลัวลงชั่วคราว ดวงอาทิตย์ขึ้นเสมอ แสวงหาความสุขที่ซ่อนอยู่ภายใน"},

    {"card_id": "major_20", "name": "Judgement",          "number": "XX",   "suit": "major",
     "keywords_up": ["Reflection","Reckoning","Absolution","Calling"],
     "keywords_rev": ["Self-doubt","Refusal of self-examination","Looming"],
     "meaning_up": "เสียงร้องยิ่งใหญ่ดังขึ้น โอกาสสำหรับการประเมินตัวเองอย่างลึกซึ้งและการเกิดใหม่อันรุ่งโรจน์รอคำตอบจากท่าน",
     "meaning_rev": "ความสงสัยทำให้เสียงร้องภายในเงียบลง การตัดสินตัวเองแข็งทื่อเป็นกรง ปล่อยวางและลุกขึ้น"},

    {"card_id": "major_21", "name": "The World",          "number": "XXI",  "suit": "major",
     "keywords_up": ["Completion","Integration","Accomplishment","Wholeness"],
     "keywords_rev": ["Incomplete","Shortcuts","Delays"],
     "meaning_up": "ท่านบรรลุถึงความสมบูรณ์แล้ว จงเต้นรำในความเต็มเปี่ยมของสิ่งที่ท่านสำเร็จ วงจรสิ้นสุดในความครบถ้วน",
     "meaning_rev": "ขั้นตอนสุดท้ายยังไม่สมบูรณ์ ปล่อยความกลัวต่อความสำเร็จและยอมให้ตัวเองมาถึง"},
]

# ─── MINOR ARCANA ───────────────────────────────────────────────────────────
RANKS = ["ace","2","3","4","5","6","7","8","9","10","page","knight","queen","king"]

SUIT_MEANINGS = {
    "cups":     {"element": "Water", "theme": "Emotions · Relationships · Intuition"},
    "wands":    {"element": "Fire",  "theme": "Passion · Creativity · Ambition"},
    "swords":   {"element": "Air",   "theme": "Intellect · Conflict · Truth"},
    "pentacles":{"element": "Earth", "theme": "Material · Work · Abundance"},
}

MINOR_MEANINGS: dict[str, dict[str, dict]] = {
    "cups": {
        "ace":    {"up": "ความรักใหม่และโอกาสทางอารมณ์เปิดขึ้นต่อหน้าท่าน", "rev": "ความรู้สึกถูกปิดกั้น ท่านระวังในการเปิดใจมากเกินไป", "kw_up": ["New love","Intuition","Creativity"], "kw_rev": ["Blocked emotions","Emptiness"]},
        "2":     {"up": "ความสัมพันธ์ที่กลมเกลียวกำลังก่อตัว การเชื่อมโยงที่ลึกซึ้ง", "rev": "ความไม่ลงรอยในความสัมพันธ์ ต้องการการสื่อสาร", "kw_up": ["Partnership","Attraction","Balance"], "kw_rev": ["Imbalance","Break-up"]},
        "3":     {"up": "การเฉลิมฉลองและมิตรภาพ ความสุขร่วมกัน", "rev": "เกินพอดี ความสัมพันธ์ที่ตึงเครียด", "kw_up": ["Celebration","Friendship","Joy"], "kw_rev": ["Overindulgence","Gossip"]},
        "4":     {"up": "การไตร่ตรองและการประเมิน หยุดพักเพื่อมองจากมุมใหม่", "rev": "ตื่นจากความเฉื่อยชา โอกาสกำลังเรียกท่าน", "kw_up": ["Contemplation","Apathy","Re-evaluation"], "kw_rev": ["Motivation","Action"]},
        "5":     {"up": "ความเสียใจและการสูญเสีย แต่ยังมีสิ่งดีเหลืออยู่เสมอ", "rev": "การยอมรับและก้าวไปข้างหน้า ปล่อยวางความเจ็บปวด", "kw_up": ["Loss","Grief","Disappointment"], "kw_rev": ["Acceptance","Moving on"]},
        "6":     {"up": "ความทรงจำและความบริสุทธิ์ของวัยเด็ก ความอบอุ่นจากอดีต", "rev": "ยึดติดกับอดีตมากเกินไป ต้องก้าวสู่ปัจจุบัน", "kw_up": ["Nostalgia","Innocence","Reunion"], "kw_rev": ["Living in past","Naivety"]},
        "7":     {"up": "ความฝันและตัวเลือกมากมาย จงแยกแยะสิ่งที่เป็นจริงจากภาพลวงตา", "rev": "ความชัดเจนกลับมา ถึงเวลาตัดสินใจอย่างเด็ดขาด", "kw_up": ["Choices","Wishful thinking","Illusion"], "kw_rev": ["Clarity","Decisiveness"]},
        "8":     {"up": "ถึงเวลาปล่อยวางและเดินหน้าต่อ ทิ้งสิ่งที่ไม่รับใช้ท่านอีกต่อไป", "rev": "ยังลังเล กลัวการเปลี่ยนแปลง", "kw_up": ["Letting go","Moving on","Transition"], "kw_rev": ["Stagnation","Fear of change"]},
        "9":     {"up": "ความพึงพอใจและความสมปรารถนา ความฝันที่เป็นจริง", "rev": "ความผิดหวังกับสิ่งที่ได้มา ต้องตรวจสอบความต้องการที่แท้จริง", "kw_up": ["Contentment","Satisfaction","Wishes fulfilled"], "kw_rev": ["Dissatisfaction","Greed"]},
        "10":    {"up": "ความสุขและความสมบูรณ์ในครอบครัวและความสัมพันธ์", "rev": "ความไม่ลงรอย ความคาดหวังที่ไม่สมจริง", "kw_up": ["Happiness","Family","Harmony"], "kw_rev": ["Disconnection","Broken home"]},
        "page":  {"up": "ข่าวดีและการเริ่มต้นใหม่ทางอารมณ์ ความอยากรู้อยากเห็น", "rev": "ข้อมูลที่บิดเบือน อารมณ์ที่ไม่มั่นคง", "kw_up": ["New feelings","Curiosity","Messages"], "kw_rev": ["Moodiness","Bad news"]},
        "knight":{"up": "การไล่ตามความรักและความฝันอย่างโรแมนติก", "rev": "อารมณ์มากเกินไป ความไม่สมจริง", "kw_up": ["Romance","Following heart","Charm"], "kw_rev": ["Unrealistic","Moodiness"]},
        "queen": {"up": "ความเมตตาและสัญชาตญาณ ผู้ดูแลที่อ่อนโยน", "rev": "ความเห็นแก่ตัว การพึ่งพาอารมณ์มากเกินไป", "kw_up": ["Compassion","Calm","Intuitive"], "kw_rev": ["Martyrdom","Insecurity"]},
        "king":  {"up": "ผู้นำด้วยหัวใจ ความสมดุลระหว่างอารมณ์และสติปัญญา", "rev": "ความเจ้าอารมณ์ การควบคุมผู้อื่นทางอารมณ์", "kw_up": ["Emotionally mature","Diplomatic","Caring"], "kw_rev": ["Moodiness","Manipulative"]},
    },
    "wands": {
        "ace":    {"up": "ประกายแห่งแรงบันดาลใจ พลังงานใหม่สำหรับการสร้างสรรค์", "rev": "แรงบันดาลใจที่ถูกปิดกั้น ความล่าช้าในการเริ่มต้น", "kw_up": ["Inspiration","New beginnings","Growth"], "kw_rev": ["Delays","Lack of energy"]},
        "2":     {"up": "การวางแผนและการมองการณ์ไกล โลกกำลังรอท่าน", "rev": "ความกลัวต่อสิ่งที่ไม่รู้จัก การขาดการวางแผน", "kw_up": ["Planning","Discovery","Future"], "kw_rev": ["Fear","Lack of planning"]},
        "3":     {"up": "การขยายตัวและโอกาสใหม่ที่กำลังมาถึง", "rev": "ความล่าช้าในแผน อุปสรรคที่ไม่คาดคิด", "kw_up": ["Expansion","Foresight","Enterprise"], "kw_rev": ["Obstacles","Delays"]},
        "4":     {"up": "การเฉลิมฉลองความสำเร็จ รากฐานที่มั่นคง บ้านอันอบอุ่น", "rev": "ความวุ่นวายในบ้าน ขาดเสถียรภาพ", "kw_up": ["Celebration","Harmony","Homecoming"], "kw_rev": ["Instability","Conflict at home"]},
        "5":     {"up": "การแข่งขันและความท้าทาย จงยืนหยัดในสนามรบ", "rev": "ความขัดแย้งที่ถูกหลีกเลี่ยง การหนีจากการเผชิญหน้า", "kw_up": ["Competition","Conflict","Challenges"], "kw_rev": ["Avoiding conflict","Resolution"]},
        "6":     {"up": "ชัยชนะที่ได้รับการยอมรับ ความสำเร็จที่โดดเด่น", "rev": "ความล้มเหลวชั่วคราว ขาดการยอมรับ", "kw_up": ["Victory","Recognition","Progress"], "kw_rev": ["Ego","Lack of recognition"]},
        "7":     {"up": "การปกป้องตำแหน่งของท่าน จงยืนหยัดต่อสู้แม้จะเหนื่อย", "rev": "ยอมแพ้เร็วเกินไป รู้สึกถูกล้อม", "kw_up": ["Perseverance","Defiance","Resilience"], "kw_rev": ["Giving up","Overwhelmed"]},
        "8":     {"up": "ความเร็วและการเคลื่อนไหว สิ่งต่างๆ เริ่มเดินหน้าอย่างรวดเร็ว", "rev": "ความล่าช้าและสิ่งที่ขัดขวาง การสื่อสารที่ติดขัด", "kw_up": ["Speed","Action","Air travel"], "kw_rev": ["Delays","Frustration"]},
        "9":     {"up": "ความแข็งแกร่งและการป้องกัน ท่านใกล้ถึงเส้นชัยแล้ว", "rev": "ความอ่อนแอ ความระแวง", "kw_up": ["Resilience","Courage","Persistence"], "kw_rev": ["Exhaustion","Paranoia"]},
        "10":    {"up": "ภาระหนักเกินไป จงตัดสินใจว่าอะไรสมควรแบก", "rev": "ปล่อยวางภาระ มอบหมายงานให้ผู้อื่น", "kw_up": ["Burden","Responsibility","Overwhelm"], "kw_rev": ["Delegation","Release"]},
        "page":  {"up": "ข่าวสารและโอกาสใหม่ ความกระตือรือร้น", "rev": "ข่าวร้าย ขาดทิศทาง", "kw_up": ["Enthusiasm","Exploration","Discovery"], "kw_rev": ["Bad news","Hastiness"]},
        "knight":{"up": "การกระทำอย่างกล้าหาญและรวดเร็ว พลังงานที่ไม่ยอมแพ้", "rev": "หุนหันพลันแล่น ขาดทิศทาง", "kw_up": ["Energy","Passion","Lust"], "kw_rev": ["Haste","Scattered"]},
        "queen": {"up": "ความมั่นใจในตัวเอง ความร้อนแรงและความมีเสน่ห์", "rev": "เจ้ากี้เจ้าการ ไม่มีความอดทน", "kw_up": ["Confidence","Determination","Joy"], "kw_rev": ["Selfishness","Jealousy"]},
        "king":  {"up": "ผู้นำที่กล้าหาญและมีวิสัยทัศน์ พลังงานที่สร้างแรงบันดาลใจ", "rev": "เจ้าอำนาจ ก้าวร้าว", "kw_up": ["Leadership","Vision","Entrepreneur"], "kw_rev": ["Impulsiveness","Aggressiveness"]},
    },
    "swords": {
        "ace":    {"up": "ความชัดเจนและความจริงอันเฉียบคม พลังงานแห่งสติปัญญา", "rev": "ความสับสน การสื่อสารที่ผิดพลาด", "kw_up": ["Clarity","Truth","Force"], "kw_rev": ["Confusion","Brutality"]},
        "2":     {"up": "ทางตัน การตัดสินใจที่ยาก จงถอดผ้าปิดตาแล้วมองความจริง", "rev": "ความสับสนผ่านไป ถึงเวลาตัดสินใจ", "kw_up": ["Stalemate","Difficult choices","Blocked"], "kw_rev": ["Indecision","Lies revealed"]},
        "3":     {"up": "ความเจ็บปวดใจและการสูญเสีย ยอมรับความเจ็บปวดเพื่อรักษา", "rev": "การฟื้นฟูจากความเจ็บปวด การให้อภัย", "kw_up": ["Heartbreak","Grief","Sorrow"], "kw_rev": ["Recovery","Forgiveness"]},
        "4":     {"up": "การพักผ่อนและการฟื้นฟู หยุดพักเพื่อสะสมพลัง", "rev": "ความอ่อนล้า การกลับมาสู่การกระทำเร็วเกินไป", "kw_up": ["Rest","Restoration","Contemplation"], "kw_rev": ["Restlessness","Burnout"]},
        "5":     {"up": "ความขัดแย้งและความพ่ายแพ้ ต้องตัดสินใจว่าการชนะนั้นคุ้มค่าหรือไม่", "rev": "การคืนดีและการปล่อยวางความขัดแย้ง", "kw_up": ["Conflict","Defeat","Tension"], "kw_rev": ["Reconciliation","Moving on"]},
        "6":     {"up": "การเดินทางสู่สันติภาพ ออกจากน้ำที่วุ่นวายสู่ความสงบ", "rev": "ยังติดอยู่กับปัญหา การต่อต้านการเปลี่ยนแปลง", "kw_up": ["Transition","Moving on","Travel"], "kw_rev": ["Emotional baggage","Resistance"]},
        "7":     {"up": "กลยุทธ์และการเจรจา บางครั้งต้องเฉลียวฉลาดเพื่อเอาตัวรอด", "rev": "การถูกจับได้ ความไม่ซื่อสัตย์ถูกเปิดเผย", "kw_up": ["Strategy","Cunning","Impulsiveness"], "kw_rev": ["Confession","Caught"]},
        "8":     {"up": "ความรู้สึกถูกกักขังและจำกัด แต่โซ่ตรวนนั้นเป็นภาพลวงตา", "rev": "การปลดปล่อยตัวเองจากความคิดที่จำกัด", "kw_up": ["Imprisonment","Restriction","Powerless"], "kw_rev": ["Release","Open mind"]},
        "9":     {"up": "ความวิตกกังวลและความกลัวในยามค่ำคืน จิตใจสร้างความทุกข์", "rev": "ความหวังกลับมา การจัดการความวิตกกังวล", "kw_up": ["Anxiety","Worry","Nightmares"], "kw_rev": ["Hope","Reaching out"]},
        "10":    {"up": "การสิ้นสุดอย่างเจ็บปวด แต่รุ่งอรุณใหม่กำลังมาถึง", "rev": "การฟื้นตัว อุปสรรคผ่านพ้น", "kw_up": ["Painful endings","Deep wounds","Betrayal"], "kw_rev": ["Recovery","Regeneration"]},
        "page":  {"up": "ความอยากรู้อยากเห็นและการสื่อสารที่คมชัด", "rev": "การนินทา ข้อมูลที่ไม่ถูกต้อง", "kw_up": ["Curiosity","Intellect","New ideas"], "kw_rev": ["Deception","Gossip"]},
        "knight":{"up": "การกระทำอย่างเด็ดขาดและรวดเร็ว ความกล้าหาญ", "rev": "หุนหันพลันแล่น ก้าวร้าว", "kw_up": ["Action","Ambitious","Direct"], "kw_rev": ["Tactless","Aggressive"]},
        "queen": {"up": "สติปัญญาและความอิสระ ความชัดเจนในความคิด", "rev": "ใจร้าย เย็นชา", "kw_up": ["Independent","Analytical","Witty"], "kw_rev": ["Coldness","Cruelty"]},
        "king":  {"up": "ผู้นำด้วยสติปัญญาและความเที่ยงตรง ความยุติธรรม", "rev": "เผด็จการ ใช้สติปัญญาทางลบ", "kw_up": ["Intellectual","Authority","Truth"], "kw_rev": ["Manipulative","Tyrannical"]},
    },
    "pentacles": {
        "ace":    {"up": "โอกาสทางวัตถุและความมั่งคั่งใหม่", "rev": "โอกาสที่เสียไป ความยากลำบากทางการเงิน", "kw_up": ["Opportunity","Manifestation","Abundance"], "kw_rev": ["Missed chance","Greed"]},
        "2":     {"up": "ความสมดุลในการจัดการหลายสิ่ง ความยืดหยุ่น", "rev": "การจัดการที่ยุ่งเหยิง ขาดความสมดุล", "kw_up": ["Balance","Adaptability","Time management"], "kw_rev": ["Disorganized","Overwhelmed"]},
        "3":     {"up": "การทำงานเป็นทีมและการฝึกฝน ฝีมือที่ได้รับการยอมรับ", "rev": "ขาดการทำงานเป็นทีม ขาดแรงจูงใจ", "kw_up": ["Teamwork","Skill","Collaboration"], "kw_rev": ["Lack of teamwork","Disorganized"]},
        "4":     {"up": "ความมั่นคงทางการเงิน แต่ระวังการยึดติดมากเกินไป", "rev": "ความตระหนี่ ความกลัวต่อความสูญเสีย", "kw_up": ["Security","Stability","Conservation"], "kw_rev": ["Greed","Materialism"]},
        "5":     {"up": "ความยากลำบากทางการเงินและวัตถุ แต่ยังมีความช่วยเหลือรออยู่", "rev": "การฟื้นตัวจากความยากลำบาก", "kw_up": ["Financial loss","Poverty","Isolation"], "kw_rev": ["Recovery","Spiritual wealth"]},
        "6":     {"up": "การให้และรับ ความอุดมสมบูรณ์ที่ไหลเวียน", "rev": "ความโลภ ความไม่เท่าเทียมในการแลกเปลี่ยน", "kw_up": ["Generosity","Charity","Prosperity"], "kw_rev": ["Greed","Selfishness"]},
        "7":     {"up": "การประเมินผลงาน หยุดพักเพื่อดูว่าเมล็ดพันธุ์ที่ปลูกงอกงามแล้วหรือยัง", "rev": "ความผิดหวังกับผลลัพธ์ ต้องเปลี่ยนกลยุทธ์", "kw_up": ["Long-term view","Reward","Perseverance"], "kw_rev": ["Impatience","Lack of reward"]},
        "8":     {"up": "การฝึกฝนและการพัฒนาทักษะอย่างมุ่งมั่น", "rev": "ขาดแรงจูงใจ งานที่น่าเบื่อ", "kw_up": ["Apprenticeship","Mastery","Dedication"], "kw_rev": ["Lack of focus","Mediocrity"]},
        "9":     {"up": "ความมั่งคั่งและความสำเร็จที่สร้างด้วยมือตัวเอง", "rev": "การพึ่งพาผู้อื่น ความสำเร็จที่กลวงเปล่า", "kw_up": ["Abundance","Self-sufficiency","Luxury"], "kw_rev": ["Overwork","Dependence"]},
        "10":    {"up": "ความมั่งคั่งระยะยาวและมรดกที่ยั่งยืน ความสุขในครอบครัว", "rev": "ปัญหาทางการเงินในครอบครัว ความขัดแย้งในมรดก", "kw_up": ["Wealth","Family","Legacy"], "kw_rev": ["Financial failure","Loss of family"]},
        "page":  {"up": "โอกาสใหม่ทางการเงินและการเรียนรู้", "rev": "ขาดการวางแผน ไม่รับผิดชอบ", "kw_up": ["Opportunity","Manifestation","Diligence"], "kw_rev": ["Procrastination","Laziness"]},
        "knight":{"up": "การทำงานหนักและความมุ่งมั่นที่จะบรรลุเป้าหมาย", "rev": "ความเฉื่อยชา ขาดความมุ่งมั่น", "kw_up": ["Hard work","Efficiency","Routine"], "kw_rev": ["Laziness","Boredom"]},
        "queen": {"up": "ความมั่งคั่งและความเอื้ออาทร ความฉลาดทางการเงิน", "rev": "การขาดความมั่นคง เจ้าอำนาจในทางวัตถุ", "kw_up": ["Nurturing","Practical","Homemaker"], "kw_rev": ["Insecurity","Greed"]},
        "king":  {"up": "ผู้นำที่ประสบความสำเร็จ ความมั่งคั่งที่สร้างด้วยปัญญา", "rev": "ความโลภและการทุจริต", "kw_up": ["Abundance","Security","Business"], "kw_rev": ["Corruption","Greed"]},
    },
}

# Build all 78 cards
ALL_CARDS: list[dict] = list(MAJOR_ARCANA)

for suit, ranks_data in MINOR_MEANINGS.items():
    for rank in RANKS:
        data = ranks_data[rank]
        card_name = f"{rank.capitalize()} of {suit.capitalize()}"
        ALL_CARDS.append({
            "card_id": f"{suit}_{rank}",
            "name": card_name,
            "number": rank.upper(),
            "suit": suit,
            "element": SUIT_MEANINGS[suit]["element"],
            "theme": SUIT_MEANINGS[suit]["theme"],
            "keywords_up": data["kw_up"],
            "keywords_rev": data["kw_rev"],
            "meaning_up": data["up"],
            "meaning_rev": data["rev"],
        })

CARDS_BY_ID: dict[str, dict] = {c["card_id"]: c for c in ALL_CARDS}
