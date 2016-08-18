<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta http-equiv="Pragma" content="no-cache" />
    <title>Uniteller</title>
    <style type="text/css">
        html,body,div,form,fieldset,input,p {
            margin: 0;
            padding: 0;
        }
        fieldset,img {
            border: 0;
        }
        #loader {
            width: 520px;
            height: 120px;
            margin: -120px 0 0 -250px;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            text-align: center;
            font: 18px "Trebuchet MS", Arial, Helvetica, sans-serif;
            color: #20864a;
        }
    </style>
</head>
<body onload="document.getElementById('frmRedirect').submit();">
    <form id="frmRedirect" action="{% $url|escape %}" method="post">
    <fieldset>
        <input type="hidden" name="context" value="{% $contextSerialized|escape %}" readonly>
    </fieldset>
    </form>
    <div id="loader">
        <p>{% ic %}Подождите, пожалуйста. Идет авторизация Вашего платежа...{% /ic %}</p>
    </div>
</body>
</html>