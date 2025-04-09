// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء عنصر روبوت المحادثة
    const chatbotHTML = `
        <button id="chatbot-toggle-btn" class="chatbot-toggle-btn">
            <i class="fas fa-comments"></i>
        </button>
        
        <div id="chatbot-widget" class="chatbot-widget collapsed">
            <div class="chatbot-header">
                <h3>مساعد الدخيل للعود</h3>
                <button class="chatbot-toggle">
                    <i class="fas fa-minus" id="chatbot-toggle-icon"></i>
                </button>
            </div>
            
            <div class="chatbot-body">
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- الرسائل ستضاف هنا ديناميكياً -->
                </div>
                
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" placeholder="اكتب رسالتك هنا...">
                    <button id="chatbot-send">إرسال</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة روبوت المحادثة إلى الصفحة
    const chatbotContainer = document.createElement('div');
    chatbotContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotContainer);
    
    // الحصول على العناصر
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotToggleIcon = document.getElementById('chatbot-toggle-icon');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    // قاعدة بيانات الردود
    const responses = {
        "مرحبا": "مرحباً بك في متجر الدخيل للعود! كيف يمكنني مساعدتك اليوم؟",
        "السلام عليكم": "وعليكم السلام ورحمة الله وبركاته! أهلاً بك في متجر الدخيل للعود. كيف يمكنني خدمتك؟",
        "ما هي المنتجات المتوفرة": "متجر الدخيل للعود متخصص في بيع أجود أنواع العطور ومنتجات العود والبخور. نقدم مجموعة متنوعة من المنتجات تشمل:\n- العطور الفاخرة\n- العود والبخور بأنواعه\n- الزيوت العطرية والمخلطات\n- عطور الشعر ومعطرات الجسم\n- معطرات المنزل\n- مجموعات الهدايا والتوزيعات\n\nهل تبحث عن فئة معينة من هذه المنتجات؟",
        "عطر راكز كراميل": "نعم، عطر راكز كراميل متوفر لدينا! إليك معلومات عنه:\n- الحجم: 150 مل\n- السعر الحالي: 149.00 ريال (خصم 50% من السعر الأصلي 298.00 ريال)\n- حالة المخزون: متوفر\n- رقم المنتج: 6281150555594\n\nهل ترغب في معرفة المزيد من التفاصيل عن هذا العطر؟",
        "ما هي سياسة الاسترجاع": "سياسة الاستبدال والاسترجاع في متجر الدخيل للعود كالتالي:\n- يسمح بالاستبدال والاسترجاع خلال خمسة أيام فقط من تاريخ الشراء\n- يشترط إحضار الفاتورة الأصلية\n- يجب أن تكون الأصناف مغلقة بالغلاف الأصلي غير مفتوح\n\nهل لديك استفسار آخر حول سياسات المتجر؟",
        "كم تستغرق عملية التوصيل": "تحرص الدخيل للعود على توصيل طلبات العملاء في وقت قياسي. عادةً ما تستغرق عملية التوصيل:\n- داخل المدن الرئيسية: 1-3 أيام عمل\n- المناطق الأخرى: 3-5 أيام عمل\n\nبمجرد شحن طلبك، ستتلقى رقم تتبع يمكنك استخدامه لمتابعة حالة الشحنة.\n\nهل لديك استفسار آخر حول عملية الشحن والتوصيل؟",
        "ما هي طرق الدفع المتاحة": "يوفر متجر الدخيل للعود عدة طرق للدفع:\n- بطاقات الائتمان/الخصم\n- التقسيط عبر خدمة تابي (4 دفعات بلا فوائد)\n- التقسيط عبر فاتورة (4 دفعات متوافقة مع الشريعة الإسلامية)\n\nهل لديك استفسار آخر حول طرق الدفع؟",
        "شكرا": "شكراً لتواصلك مع متجر الدخيل للعود! سعدت بمساعدتك اليوم. إذا كان لديك أي استفسارات أخرى في المستقبل، لا تتردد في التواصل معنا مرة أخرى. نتمنى لك يوماً سعيداً!"
    };
    
    // الاقتراحات الشائعة
    const suggestions = [
        "ما هي المنتجات المتوفرة؟",
        "ما هي سياسة الاسترجاع؟",
        "كم تستغرق عملية التوصيل؟",
        "ما هي طرق الدفع المتاحة؟"
    ];
    
    // الرد الافتراضي
    const defaultResponse = "آسف، لم أفهم استفسارك. هل يمكنك إعادة صياغته بطريقة أخرى؟ أو يمكنك الاستفسار عن المنتجات المتوفرة، سياسة الاسترجاع، عملية التوصيل، أو طرق الدفع.";
    
    // فتح/إغلاق روبوت المحادثة
    function toggleChatbot() {
        chatbotWidget.classList.toggle('collapsed');
        
        if (chatbotWidget.classList.contains('collapsed')) {
            chatbotToggleIcon.className = 'fas fa-plus';
            chatbotToggleBtn.classList.remove('hidden');
        } else {
            chatbotToggleIcon.className = 'fas fa-minus';
            chatbotToggleBtn.classList.add('hidden');
            chatbotInput.focus();
            
            // إذا كانت هذه أول مرة يتم فيها فتح الروبوت، أضف رسالة الترحيب
            if (chatbotMessages.children.length === 0) {
                addBotMessage("مرحباً بك في متجر الدخيل للعود! أنا المساعد الافتراضي الخاص بالمتجر، وأسعد بمساعدتك. كيف يمكنني خدمتك اليوم؟");
                addSuggestions(suggestions);
            }
        }
    }
    
    // إضافة رسالة من الروبوت
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', 'bot');
        messageDiv.textContent = message;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('chatbot-message-time');
        timeDiv.textContent = getCurrentTime();
        
        messageDiv.appendChild(timeDiv);
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // إضافة رسالة من المستخدم
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', 'user');
        messageDiv.textContent = message;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('chatbot-message-time');
        timeDiv.textContent = getCurrentTime();
        
        messageDiv.appendChild(timeDiv);
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // إضافة اقتراحات
    function addSuggestions(suggestionList) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.classList.add('chatbot-suggestions');
        
        suggestionList.forEach(suggestion => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.classList.add('chatbot-suggestion');
            suggestionBtn.textContent = suggestion;
            
            suggestionBtn.addEventListener('click', () => {
                chatbotInput.value = suggestion;
                sendMessage();
            });
            
            suggestionsDiv.appendChild(suggestionBtn);
        });
        
        chatbotMessages.appendChild(suggestionsDiv);
        scrollToBottom();
    }
    
    // إضافة مؤشر الكتابة
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chatbot-typing');
        typingDiv.id = 'chatbot-typing';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('chatbot-typing-dot');
            typingDiv.appendChild(dot);
        }
        
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // إزالة مؤشر الكتابة
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('chatbot-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // التمرير إلى أسفل المحادثة
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // الحصول على الوقت الحالي
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes}`;
    }
    
    // إرسال رسالة
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // إضافة رسالة المستخدم
        addUserMessage(message);
        chatbotInput.value = '';
        
        // إضافة مؤشر الكتابة
        addTypingIndicator();
        
        // محاكاة تأخير الرد
        setTimeout(() => {
            // إزالة مؤشر الكتابة
            removeTypingIndicator();
            
            // البحث عن رد مناسب
            let response = defaultResponse;
            let foundMatch = false;
            
            for (const [key, value] of Object.entries(responses)) {
                if (message.toLowerCase().includes(key.toLowerCase())) {
                    response = value;
                    foundMatch = true;
                    break;
                }
            }
            
            // إضافة رد الروبوت
            addBotMessage(response);
            
            // إضافة اقتراحات إذا لم يتم العثور على تطابق
            if (!foundMatch) {
                addSuggestions(suggestions);
            }
        }, 1500);
    }
    
    // إضافة مستمعي الأحداث
    chatbotToggleBtn.addEventListener('click', toggleChatbot);
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
