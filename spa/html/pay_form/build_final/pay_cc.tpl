{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
    $this->assign('template_dir', dirname($file));
    $this->assign('currentDate', date('H:i'));
    $payment_menu = $this->get_template_vars('payment_menu');
{% /php %}

{% capture name="title" %}
    Страница оплаты
{% /capture %}

{% capture name="js %}
    <script type="text/javascript" src="{% $custom %}/js/libs.js"></script>
    <script type="text/javascript" src="{% $custom %}/js/app.js"></script>
{% /capture %}

{% capture name="body" %}
    <div class="pay-form__title">
        Заказ №{% $context.Order_IDP|escape %}
    </div>

    {% include file="$template_dir/errors.inc.tpl" generalOnly=true %}

    <form id="paymentForm" method="post" name="PaymentForm" action="{% url removeString='procError' %}{% $conf.currentUrl %}{% /url %}">

        <input type="hidden" name="context" value="{% $contextSerialized|escape %}" />
        <input type="hidden" name="doPay" value="1" />
        <input type="hidden" name="" id="inputBack" value="1" />

        <input type="hidden" name="formType" value="standart" />
        <input type="hidden" name="Address" value="*НЕ ЗАДАВАЛСЯ*">
        <input type="hidden" name="Phone" value="0000000">
        <input type="hidden" name="IssuerName" value="*НЕ ЗАДАВАЛСЯ*">
        <input type="hidden" name="IssuerSupportPhone" value="0000000">
        <input type="hidden" name="Country" value="*НЕ ЗАДАВАЛСЯ*">
        <input type="hidden" name='CardholderName' value="NONAME" />

        {%assign var='random' value=100000|rand:1000000%}
        <input type="hidden" name="Email" value="{% if $isValidEmail == 1 %}{% $context.Email|escape %}{% else %}{% $random %}@address.ru{% /if %}" />

        <div class="pay-form-fields">
            <div class="pay-form-fields__cart-data">
                <div class="pay-form-fields__cart-data-container">
                    <div class="pay-form-fields__cart-data-icons">
                        <i class="icon-visa"></i>
                        <i class="icon-master"></i>
                    </div>
                    <div class="pay-form-fields__cart-data-field number">
                        <input
                           id="number"
                           type="text"
                           name="number"
                           class="form-control gray-border"
                           ng-model="ccForm.number"
                           placeholder="Номер карты"

                           ui-mask="9999 9999 9999 9999?9?9"
                           ui-mask-placeholder
                           ui-mask-placeholder-char="space"

                           message-id="messageFormNumber"
                           validator="required"
                           valid-method="watch"
                           required-error-message="Укажите номер карты"

                           ng-change="validationValidHandler('number', PaymentForm.number)"
                            />

                        <div class="FieldError"
                             id="messageFormNumber"></div>
                    </div>

                    <div class="pay-form-fields__cart-data-field date">
                        <label class="form-label">Действительна до:</label>
                        <div class="date-field__container">
                            <div class="date-field__container-item">
                                <label class="form-label date-field__container-item--label" for="monthInput">Месяц (1 - 12)</label>
                                <input
                                id="monthInput"
                                    class="form-control gray-border"
                                    ng-model="ccForm.month"
                                    ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }"
                                    name="month"
                                    placeholder="ММ"

                                    ui-mask="9?9"
                                    ui-mask-placeholder
                                    ui-mask-placeholder-char="space"

                                    message-id="messageFormMonth"
                                    validator="required, number, month, minlength=1, maxlength=2"
                                    valid-method="watch"
                                    required-error-message="Укажите месяц от 1 до 12"
                                    number-error-message="Укажите месяц от 1 до 12"
                                    minlength-error-message="Укажите месяц от 1 до 12"
                                    maxlength-error-message="Укажите месяц от 1 до 12"

                                    ng-change="validationValidHandler('month', PaymentForm.month)"

                                    />
                            </div>
                            <span>/</span>
                            <div class="date-field__container-item">
                                <label class="form-label date-field__container-item--label" for="yearInput">Год (01 - 99)</label>
                                <input
                                    id="yearInput"
                                    class="form-control gray-border"
                                    ng-model="ccForm.year"
                                    ng-model-options="{ debounce: { 'default': 500, 'blur': 0 } }"
                                    name="ExpYear"
                                    placeholder="ГГ"

                                    ui-mask="99"
                                    ui-mask-placeholder
                                    ui-mask-placeholder-char="space"

                                    message-id="messageFormYear"
                                    validator="required, number, year"
                                    valid-method="watch"
                                    required-error-message="Укажите год от 01 до 99"
                                    number-error-message="Укажите год от 01 до 99"

                                    ng-change="validationValidHandler('year', PaymentForm.year)"
                                    />
                            </div>
                        </div>
                        <div class="FieldError"
                             id="messageFormMonth"></div>

                        <div class="FieldError"
                             id="messageFormYear"></div>

                    </div>


                    <!--
                    <div class="pay-form-fields__cart-data-field fio">
                        <input
                                id="usernameInput"
                                class="form-control gray-border"
                                type="text"
                                ng-model="ccForm.username"
                                placeholder="Держатель карты"
                        />
                    </div>
                    -->

                </div>
            </div>
            <div class="pay-form-fields__cart-cvs">
                <div class="pay-form-fields__cart-cvs-container">
                    <div class="pay-form-fields__cart-cvs-field_line">
                    </div>
                    <div class="pay-form-fields__cart-cvs-field">
                        <div class="wrap-cvc">
                            <input
                                id="cvsInput"
                                type="password"
                                class="form-control gray-border"
                                name="Cvc2"
                                ng-model="ccForm.cvc"
                                ng-model-options="{ debounce: { 'default': 600, 'blur': 0 } }"
                                placeholder="CVC"

                                message-id="messageFormCvc"
                                validator="required, number, minlength=3, maxlength=4"
                                valid-method="watch"
                                required-error-message="Укажите cvc код"
                                number-error-message="Допустимо только число"
                                minlength-error-message="Число длинной от 3 до 4 знаков"
                                maxlength-error-message="Число длинной от 3 до 4 знаков"
                                ng-change="validationValidHandler('cvc', PaymentForm.cvc)"
                                />

                            <div class="FieldError"
                                 id="messageFormCvc"></div>
                            <label for="cvsInput" class="form-label form-label__cvsInput">
                                Три цифры
                                с обратной
                                стороны
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pay-form-actions">

            <div class="pay-form__price">
                <div class="pay-form__price-label">Сумма к оплате</div>
                <div class="pay-form__price-value">{% $context.Subtotal_P|escape %} <span class="ruble">c</span></div>
            </div>

            <div class="pay-form-actions__btn">
                <input
                    type="submit"
                    id="formBtn"
                    class="form-btn background-green"
                    value="Оплатить"
                    ng-disabled="!form.checkValid(PaymentForm)"
                    ng-click="form.submit($event, PaymentForm)"
                    >
            </div>

        </div>
    </form>





    {%*
    <form method="post" action="{% url removeString='procError' %}{% $conf.currentUrl %}{% /url %}" id="payForm" onsubmit="return validateForm(this)">

        <input type="hidden" name="context" value="{% $contextSerialized|escape %}" />
        <input type="hidden" name="doPay" value="1" />
        <input type="hidden" name="" id="inputBack" value="1" />

        <input type="hidden" name="formType" value="standart" />
        <input type="hidden" name="Address" value="*НЕ ЗАДАВАЛСЯ*">
        <input type="hidden" name="Phone" value="0000000">
        <input type="hidden" name="IssuerName" value="*НЕ ЗАДАВАЛСЯ*">
        <input type="hidden" name="IssuerSupportPhone" value="0000000">
        <input type="hidden" name="Country" value="*НЕ ЗАДАВАЛСЯ*">

        {%assign var='random' value=100000|rand:1000000%}
        <input type="hidden" name="Email" value="{% if $isValidEmail == 1 %}{% $context.Email|escape %}{% else %}{% $random %}@address.ru{% /if %}" />

        <div class="ufs-wrapper clearfix">

            <h2 class="ufs-title ufs-content-left">Оплата заказа <span class="ufs-title_sum">на сумму {% $context.Subtotal_P|escape %} <span class="rouble">руб</span></span></h2>
            {% include file="$template_dir/errors.inc.tpl" generalOnly=true %}

            <div class="ufs-content-left">
                <div class="ufs-payment clearfix">
                    <div class="ufs-card ufs-card--frontside">

                        <ul class="ufs-providers">
                            <li class="ufs-providers_item ufs-providers_item--visa"></li>
                            <li class="ufs-providers_item ufs-providers_item--mastercard"></li>
                        </ul>

                        <ul class="ufs-data-card">
                            <li class="ufs-data-card_row ufs-data-card_row--other">

                            </li>
                            <li class="ufs-data-card_row">
                                <label class="ufs-data-card_label" for="cardNumber">Номер карты</label>
                                <div class="ufs-data-card_item">
                                    <input type="text" id="cardNumber" autocomplete="off" name='Pan' tabindex='1' class="ufs-data-card_input" maxlength="19" />
                                    <span class="ufs-data-card_hint-error hide" data-id='cardNumber'>Укажите номер карты</span>
                                </div>
                            </li>
                            <li class="ufs-data-card_row ufs-data-card_row--selects clearfix">
                                <div class="ufs-justified">
                                    <div class="ufs-justified_item">
                                        <label class="ufs-data-card_label" for="cardYear">Год</label>
                                        <div class="ufs-data-card_item ufs-data-card_item--year">
                                            <select id="cardYear" name='ExpYear' tabindex='3' class="ufs-select"><option></option><option value="2015">15</option><option value="2016">16</option><option value="2017">17</option><option value="2018">19</option><option value="2019">19</option><option value="2020">20</option><option value="2021">21</option><option value="2022">22</option><option value="2023">23</option><option value="2024">24</option><option value="2025">25</option></select>
                                        </div>
                                    </div>
                                    <div class="ufs-justified_item">
                                        <label class="ufs-data-card_label" for="cardMonth">Месяц</label>
                                        <div class="ufs-data-card_item">
                                            <select id="cardMonth" name='ExpMonth' tabindex='2' class="ufs-select"><option></option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>
                                        </div>
                                    </div>
                                    <span class="ufs-data-card_hint-error hide" data-id='cardDate'>Укажите срок действия карты</span>
                                </div>
                            </li>
                            <li class="ufs-data-card_row">
                                <label class="ufs-data-card_label" for="cardOwner">Имя владельца карты</label>
                                <div class="ufs-data-card_item">
                                    <input type="text" name='CardholderName' autocomplete="off" tabindex='4' id="cardOwner" class="ufs-data-card_input ufs-data-card_input--owner" />
                                    <span class="ufs-data-card_hint-error hide" data-id='cardOwner'>Укажите имя владельца, так же как на карте внизу</span>
                                </div>
                            </li>
                            {% if isset($isCustomer) && $isCustomer %}
                            <li class="ufs-data-card_row ufs-data-card_row--remember">
                                <div class="ufs-data-card_item ufs-data-card_item--checkbox">
                                    <input type="checkbox" id="cardRemember" class="ufs-data-card_checkbox" checked="checked" name='chSaveCard' value='1' />
                                    <label class="ufs-data-card_label ufs-data-card_label--checkbox" for="cardRemember">Запомнить карту для последующих покупок</label>
                                    <span class="ufs-data-card_hint">При следующей покупке вам потребуется ввести только CVV-код</span>
                                </div>
                            </li>
                            {% /if %}
                        </ul>
                    </div>
                    <div class="ufs-card ufs-card--backside">
                        <ul class="ufs-data-card">
                            <li class="ufs-data-card_row">
                                <label class="ufs-data-card_label" for="cardCvc">CVV</label>
                                <div class="ufs-data-card_item">
                                    <input id="cardCvc" type="password" autocomplete="off" tabindex='5' maxlength="4" name='Cvc2' class="ufs-data-card_input ufs-data-card_input--cvc" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div><div class="ufs-content-right">

                <div class="ufs-total-amount">
                    <p>Сумма: <span class="ufs-total-amount_price">{% $context.Subtotal_P|escape %} <span class="rouble">руб</span></span></p>
                </div>

                <div class="ufs-route-info">
                    <p>{% $context.Comment %}</p>
                </div>

                <div class="ufs-purchase">
                    <button type="submit" class="ufs-button" tabindex='6'>
                        Оплатить <span class="ufs-button_amount">{% $context.Subtotal_P|escape %} <span class="rouble">руб</span></span>
                    </button>
                    <span class="ufs-hint">Заполните данные банковской карты</span>
                </div>


            </div>

            <div class="ufs-support ufs-content-right">
                <p>Служба поддержки УФС:</p>
                <p><a href="tel:+74952698365" class="ufs-link">+7 (495) 269-83-65 (круглосуточно)</a></p>
                <p><a href="mailto:support@ufs-online.ru" class="ufs-link">support@ufs-online.ru</a></p>
            </div>

            <div class="ufs-protection ufs-content-left">
                <p>Информация, которую вы указываете на данной странице, передается в зашифрованном виде по защищенному протоколу SSL3.0. Данные вашей банковской карты обрабатываются платежным шлюзом Gateline.net и передаются напрямую в банк-эквайер по защищенному протоколу. В соответствии с требованиями стандарта PCI DSS 2.0 платежный шлюз не сохраняет никакие критичные данные вашей карты.</p>
            </div>

        </div>
    </form>
                        *%}
{% /capture %}

{% assign var="baseFile" value="$template_dir/base.tpl" %}
{% include file=$baseFile
        title=$smarty.capture.title|default:''
        js=$smarty.capture.js|default:''
        body=$smarty.capture.body|default:''
%}
