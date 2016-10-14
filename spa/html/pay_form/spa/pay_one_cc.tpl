{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
    $this->assign('template_dir', dirname($file));
{% /php %} 

{% capture name="title" %}
    Страница оплаты
{% /capture %}

{% capture name="js" %}
    <script type="text/javascript" src="{% $custom %}/js/pay.js"></script>
{% /capture %}

{% capture name="body" %}

<div id="pay">
    <div class="corner" id="text">
        <div class="number_sum">Заказ № {% $context.Order_IDP %} на сумму {% $context.Subtotal_P %} руб.</div>
    </div>
    
    <form method="post" action="{% url removeString='procError' %}{% $conf.currentUrl|escape %}{% /url %}" id="payForm" data-role="box" class="the-box the-box-form the-box-user swiper-slide-visible">
    <fieldset>        
        <input type="hidden" name="context" value="{% $contextSerialized|escape %}">
        <input type="hidden" name="doPay" value="1">
        <input type="hidden" name="" id="inputBack" value="1">
        <input type="hidden" value="standart" name="formType">

        <input type="hidden" name="Phone" value="{% $context.Phone|default:'0000000'%}">

        <div id="menu_title">
            <h2>Cпособ оплаты:</h2>
        </div>

        {% if empty($card_error) %}
        <div class="sc_menu">Банковская карта {% $card.mask|escape %}</div>
            <input type="hidden" value="{% $card.cid|escape %}" name="cid">
            <div id="fix_cid">
                Оплата картой:
                <br>
                <span>{% $card.mask|escape %}</span>
            </div>
        {% else %}
            <div class="sc_menu">Банковская карта </div>
            <div class="text_error">
                <p>{% ic %}{% $card_error %}{% /ic %}</p>
            </div>
        {% /if %}
        
        {% if empty($card_error) %}
        <div id="logo_visa" class="logo"></div>
        <div id="logo_masterkard" class="logo"></div>
        <label id="lCvc2" for="Cvc2">CVV2/CVC2:</label>
        <input id="Cvc2" class="text" type="password" maxlength="4" title="CVV2/CVC2" autocomplete="off" tabindex="5" name="Cvc2">
        {% /if %}
        
        <div id="btns">
            {% if empty($card_error) %}
            <button id="btnPay_card" class="corner" type="submit" tabindex="8">Оплатить</button>
            {% /if %}
            <button id="btnBack" class="corner" onclick="document.getElementById('inputBack').name = 'back'; document.getElementById('payForm').submit(); return true;" tabindex="9">
                <div id="logo_button"></div>
            </button>
            <a id="logo_uniteller" class="logo" target="_blank" href="http://uniteller.ru">Uniteller</a>
        </div>
       
    </fieldset>
    </form>
</div>
{% /capture %}




{% assign var="baseFile" value="$template_dir/base.tpl" %}
{% include file=$baseFile
    title=$smarty.capture.title|default:''
    js=$smarty.capture.js|default:''
    body=$smarty.capture.body|default:''
%}