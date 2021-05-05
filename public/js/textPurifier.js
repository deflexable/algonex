function purifyTextEntity(value) {
    var output = '';
    for (var i = 0; i < value.length; i++) {
        switch (value[i]) {
            case '\\':
                output += '&#92;';
                break;
            case ' ':
                output += '&#32;';
                break;
            case '/':
                output += '&#47;';
                break;
            case '!':
                output += '&#33;';
                break;
            case '"':
                output += '&#34;';
                break;
            case '#':
                output += '&#35;';
                break;
            case '$':
                output += '&#36;';
                break;
            case '%':
                output += '&#37';
                break;
            case '&':
                output += '&#38;';
                break;
            case "'":
                output += '&#39;';
                break;
            case '(':
                output += '&#40;';
                break;
            case ')':
                output += '&#41;';
                break;
            case '*':
                output += '&#42;';
                break;
            case '+':
                output += '&#43;';
                break;
            case ',':
                output += '&#44;';
                break;
            case '.':
                output += '&#46;';
                break;
            case ':':
                output += '&#58;';
                break;
            case ';':
                output += '&#59;';
                break;
            case '<':
                output += '&#60;';
                break;
            case '=':
                output += '&#61;';
                break;
            case '>':
                output += '&#62;';
                break;
            case '?':
                output += '&#63;';
                break;
            case '@':
                output += '&#64;';
                break;
            case "[":
                output += '&#91;';
                break;
            case ']':
                output += '&#93;';
                break;
            case '^':
                output += '&#94;';
                break;
            case '_':
                output += '&#95;';
                break;
            case '`':
                output += '&#96;';
                break;
            case '{':
                output += '&#123;';
                break;
            case '|':
                output += '&#124;';
                break;
            case '}':
                output += '&#125;';
                break;
            case '~':
                output += '&#126;';
                break;
            case '×':
                output += '&#215;';
                break;
            case '÷':
                output += '&#247;';
                break;
            case '.':
                output += '&#8901;';
                break;
            case '–':
                output += '&#8211;';
                break;
            case '—':
                output += '&#8212;';
                break;
            case '‘':
                output += '&#8216;';
                break;
            case '’':
                output += '&#8217;';
                break;
            case '‚':
                output += '&#8218;';
                break;
            case '“':
                output += '&#8220;';
                break;
            case '”':
                output += '&#8221;';
                break;
            case '„':
                output += '&#8222;';
                break;
            case '•':
                output += '&#8226;';
                break;
            case '′':
                output += '&#8242;';
                break;
            case '″':
                output += '&#8243;';
                break;
            case '™':
                output += '&#8482;';
                break;
            case '⌈':
                output += '&#8968;';
                break;
            case '⌉':
                output += '&#8969;';
                break;
            case '⌊':
                output += '&#8970;';
                break;
            case '⌋':
                output += '&#8971;';
                break;
            default:
                output += value[i];
        }
    }
    return output;
}