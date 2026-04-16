import os
import re

dir_path = r"c:\Users\4-410-07\Desktop\26.04.16"
index_path = os.path.join(dir_path, "index.html")

with open(index_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Extract head
head_match = re.search(r'<head>.*?</head>', text, re.DOTALL)
head = head_match.group(0) if head_match else ''

nav_kr_en = """  <nav>
    <div class="logo">HANWHA AEROSPACE</div>
    <ul style="align-items: center;">
      <li><a href="index.html#hero">HOME</a></li>
      <li><a href="index.html#protect">TRUST</a></li>
      <li><a href="tech.html">TECH</a></li>
      <li><a href="innovation.html">INNOVATION</a></li>
      <li><a href="index.html#board-section">BOARD</a></li>
      <li><a href="index.html#contact">JOIN</a></li>
      <li><button id="lang-toggle" class="lang-btn">🇰🇷 KR</button></li>
    </ul>
  </nav>"""

plc_modal = re.search(r'<div id="modal-plc".*?(?=<div id="modal-cad")', text, re.DOTALL)
plc_modal_str = plc_modal.group(0) if plc_modal else ''

cad_modal = re.search(r'<div id="modal-cad".*?(?=<!-- Layer 3)', text, re.DOTALL)
cad_modal_str = cad_modal.group(0) if cad_modal else ''

sustainable = re.search(r'<!-- Step 4: Section 2 - SUSTAINABLE: Technical Mastery -->\s*<section id="sustainable">.*?</section>', text, re.DOTALL)
sustainable_str = sustainable.group(0) if sustainable else ''

discover = re.search(r'<!-- Step 5: Section 3 - DISCOVER: Innovation & Future -->\s*<section id="discover">.*?</section>', text, re.DOTALL)
discover_str = discover.group(0) if discover else ''

tech_html = f"""<!DOCTYPE html>
<html lang="ko">
{head.replace('<title>Hanwha Aerospace | Premium Portfolio</title>', '<title>Hanwha Aerospace | TECH</title>')}
<body>
  <div id="canvas-container"></div>
{nav_kr_en}

{plc_modal_str}
{cad_modal_str}

  <main id="main-content" style="padding-top: 100px;">
{sustainable_str}
  </main>
  <script src="script.js"></script>
</body>
</html>
"""

innovation_html = f"""<!DOCTYPE html>
<html lang="ko">
{head.replace('<title>Hanwha Aerospace | Premium Portfolio</title>', '<title>Hanwha Aerospace | INNOVATION</title>')}
<body>
  <div id="canvas-container"></div>
{nav_kr_en}

  <main id="main-content" style="padding-top: 100px;">
{discover_str}
  </main>
  <script src="script.js"></script>
</body>
</html>
"""

new_index = re.sub(
    r'<ul style="align-items: center;">.*?</ul>',
    """<ul style="align-items: center;">
      <li><a href="#hero">HOME</a></li>
      <li><a href="#protect">TRUST</a></li>
      <li><a href="tech.html">TECH</a></li>
      <li><a href="innovation.html">INNOVATION</a></li>
      <li><a href="#board-section">BOARD</a></li>
      <li><a href="#contact">JOIN</a></li>
      <li><button id="lang-toggle" class="lang-btn">🇰🇷 KR</button></li>
    </ul>""",
    text,
    flags=re.DOTALL
)

gateway_sustainable = """<!-- Step 4: Section 2 - SUSTAINABLE: Technical Mastery -->
    <section id="sustainable" style="text-align: center; padding: 10rem 0;">
      <h2 class="gsap-header">TECH: Technical Mastery</h2>
      <p style="color: var(--text-secondary); margin-bottom: 3rem;" class="gsap-text i18n"
        data-kr="시대를 앞서가는 스마트 팩토리 설계 및 정밀 제어 솔루션"
        data-en="Pioneering Smart Factory Design & Precision Control Solutions.">
        시대를 앞서가는 스마트 팩토리 설계 및 정밀 제어 솔루션
      </p>
      <a href="tech.html" class="btn-contact" style="display: inline-block; padding: 1rem 3rem; font-size: 1.2rem; cursor: pointer; text-decoration: none;">View Tech Portfolio</a>
    </section>"""

gateway_discover = """<!-- Step 5: Section 3 - DISCOVER: Innovation & Future -->
    <section id="discover" style="text-align: center; padding: 10rem 0;">
      <h2 class="gsap-header">INNOVATION: Innovation Lab</h2>
      <p style="margin-bottom: 2rem; color: var(--text-secondary);" class="gsap-text i18n"
        data-kr="인공지능과 바이브 코딩으로 여는 제조 혁신의 미래" 
        data-en="Future of Manufacturing via AI & Vibe Coding.">인공지능과 바이브 코딩으로 여는 제조 혁신의 미래</p>
      <a href="innovation.html" class="btn-contact" style="display: inline-block; padding: 1rem 3rem; font-size: 1.2rem; cursor: pointer; text-decoration: none;">View Innovation Lab</a>
    </section>"""

new_index = re.sub(r'<!-- Step 4: Section 2 - SUSTAINABLE: Technical Mastery -->\s*<section id="sustainable">.*?</section>', gateway_sustainable, new_index, flags=re.DOTALL)
new_index = re.sub(r'<!-- Step 5: Section 3 - DISCOVER: Innovation & Future -->\s*<section id="discover">.*?</section>', gateway_discover, new_index, flags=re.DOTALL)

with open(os.path.join(dir_path, 'tech.html'), 'w', encoding='utf-8') as f:
    f.write(tech_html)

with open(os.path.join(dir_path, 'innovation.html'), 'w', encoding='utf-8') as f:
    f.write(innovation_html)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_index)

print("HTML logic separated into tech.html and innovation.html")
