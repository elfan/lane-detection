<?php
$whitelist = 'yzi:g:l:h:v:w:r:t:d:n:x:';
$params = [];
foreach ($_GET as $key => $val) {
    if (strlen($key) === 1 && preg_match("/".preg_quote($key)."/", $whitelist)) {  //whitelisted param
        if (preg_match("/".preg_quote($key) . ":/", $whitelist)) { //param may have value
            if (preg_match("/^[0-9]+$/", $val)) {  //value must be integers
                $params[$key] = $val;
            }
            else {
                exit;
            }
        }
        else {
            $params[$key] = true;  //param just exist, no value
        }
    }
    else {
        exit;
    }
}

$paramstr = '';
foreach ($params as $key => $val) {
    $paramstr .= ' -' . $key . ($val === true ? '' : ' ' . $val);
}

header("Content-type: image/png");
passthru("python3 lane.py" . $paramstr);