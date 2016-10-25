{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
{% /php %} 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>{% $title|default:'' %}</title>
    
    <link rel="stylesheet" href="{% $custom %}/css/style.css">
    <script type="text/javascript" src="{% $custom %}/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="{% $custom %}/js/jquery.inputmask.js"></script>
    <script type="text/javascript" src="{% $custom %}/js/jquery.inputmask.extensions.js"></script>
    <script type="text/javascript" src="{% $custom %}/js/validate.js"></script>
    
    {% $css|default:'' %}
    {% $js|default:'' %}
    
</head>
<body>
{% $body|default:'' %}
</body>
</html>