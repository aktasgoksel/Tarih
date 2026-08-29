import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_logic = r'''                let scoreText = '';
                if(isFinished) {
                    const score = userData.testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${index + 1}. ${test.title}${scoreText}`;
                dropdown.appendChild(opt);'''

new_logic = r'''                let scoreText = '';
                if(isFinished) {
                    const score = userData.testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${test.title}${scoreText}`;
                dropdown.appendChild(opt);'''

content = content.replace(old_logic, new_logic)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Redundant numbers removed successfully!")
