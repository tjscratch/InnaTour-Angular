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
        
        {%assign var='random' value=100000|rand:1000000%} 
        <input type="hidden" name="Email" value="{% if $isValidEmail == 1 %}{% $context.Email|escape %}{% else %}{% $random %}@address.ru{% /if %}" />	
    

        <div id="menu_title">
            <h2>Cпособ оплаты:</h2>
        </div>
        <div class="sc_menu">Банковская карта </div>
        
        {% if !empty($aErrors) %}
            {% foreach item=item key=key from=$aErrors %}
                {% if is_numeric($key) %}
                <div class="text_error">
                    <p>{% ic %}{% $item %}{% /ic %}</p>
                </div>
                {% /if %}
            {% /foreach %}
        {% /if %}    
            
        <div id="menu_title">
            <h2>Номер карты:</h2>
            <input id="Pan" class="text" type="text" maxlength="19" value="" title="Номер карты" autocomplete="off" tabindex="1" name="Pan" style="border-color: rgb(0, 0, 0);">
        </div>
        <label for="ExpMonth">Срок действия:</label>
        <select id="ExpMonth" class="text" title="Месяц" autocomplete="off" tabindex="2" name="ExpMonth">
            {% foreach from=$aMonths item="name" key="value" %}
                <option value="{% $value|escape %}">{% $name|escape %}</option>
            {% /foreach %}
        </select>
        <select id="ExpYear" class="text" title="Год" autocomplete="off" tabindex="3" name="ExpYear">
            {% foreach from=$aYears item="name" key="value" %}
                <option value="{% $value|escape %}">{% $name|escape %}</option>
            {% /foreach %}
        </select>

        <div id="menu_title">
            <h2>Имя держателя карты:</h2>
            <input id="CardholderName" class="text" type="text" value="" title="Имя держателя карты" autocomplete="off" tabindex="4" name="CardholderName">
        </div>

        <div id="logo_visa" class="logo"></div>
        <div id="logo_masterkard" class="logo"></div>
        <label id="lCvc2" for="Cvc2">CVV2/CVC2:</label>
        <input id="Cvc2" class="text" type="password" maxlength="4" title="CVV2/CVC2" autocomplete="off" tabindex="5" name="Cvc2">

        {% if isset($isCustomer) && $isCustomer %}
            <div id="save_card">
                <input type="checkbox" id="chSaveCard" name="chSaveCard" tabindex="6" value="1" title="Сохранить данные карты?" checked="checked" />
                <label for="chSaveCard" id="lchSaveCard">Сохранить данные карты?</label>
            </div>
        {% else %}
            <div id="empty_save_card"></div>
        {% /if %}

        <div id="menu_title" class="{% if $isValidEmail == 1 %} hide {% /if %}">
            <h2>E-Mail:</h2>
            {%assign var='random' value=100000|rand:1000000%} 
            <input id="Email" class="text" type="text" maxlength="64" title="E-Mail" value="{% $context.Email|escape %}" tabindex="7" name="Email" style="border-color: rgb(0, 0, 0);">
        </div>

        <div id="btns">
            <button id="btnPay" class="corner" type="submit" tabindex="8">Оплатить</button>
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