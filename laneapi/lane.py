import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
import cv2
import math
import sys
import getopt

def grayscale(img):
    """Applies the Grayscale transform
    This will return an image with only one color channel
    but NOTE: to see the returned image as grayscale
    (assuming your grayscaled image is called 'gray')
    you should call plt.imshow(gray, cmap='gray')"""
    return cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    # Or use BGR2GRAY if you read an image with cv2.imread()
    # return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def canny(img, low_threshold, high_threshold):
    """Applies the Canny transform"""
    return cv2.Canny(img, low_threshold, high_threshold)

def gaussian_blur(img, kernel_size):
    """Applies a Gaussian Noise kernel"""
    return cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)

def region_of_interest(img, vertices):
    """
    Applies an image mask.

    Only keeps the region of the image defined by the polygon
    formed from `vertices`. The rest of the image is set to black.
    `vertices` should be a numpy array of integer points.
    """
    #defining a blank mask to start with
    mask = np.zeros_like(img)

    #defining a 3 channel or 1 channel color to fill the mask with depending on the input image
    if len(img.shape) > 2:
        channel_count = img.shape[2]  # i.e. 3 or 4 depending on your image
        ignore_mask_color = (255,) * channel_count
    else:
        ignore_mask_color = 255

    #filling pixels inside the polygon defined by "vertices" with the fill color    
    cv2.fillPoly(mask, vertices, ignore_mask_color)
    
    #returning the image only where mask pixels are nonzero
    masked_image = cv2.bitwise_and(img, mask)
    return masked_image


def draw_lines(img, lines, color=[255, 0, 0], thickness=2):
    """
    NOTE: this is the function you might want to use as a starting point once you want to 
    average/extrapolate the line segments you detect to map out the full
    extent of the lane (going from the result shown in raw-lines-example.mp4
    to that shown in P1_example.mp4).  
    
    Think about things like separating line segments by their 
    slope ((y2-y1)/(x2-x1)) to decide which segments are part of the left
    line vs. the right line.  Then, you can average the position of each of 
    the lines and extrapolate to the top and bottom of the lane.
    
    This function draws `lines` with `color` and `thickness`.    
    Lines are drawn on the image inplace (mutates the image).
    If you want to make the lines semi-transparent, think about combining
    this function with the weighted_img() function below
    """
    for line in lines:
        for x1,y1,x2,y2 in line:
            cv2.line(img, (x1, y1), (x2, y2), color, thickness)

def hough_lines(img, rho, theta, threshold, min_line_len, max_line_gap):
    """
    `img` should be the output of a Canny transform.
        
    Returns an image with hough lines drawn.
    """
    lines = cv2.HoughLinesP(img, rho, theta, threshold, np.array([]), minLineLength=min_line_len, maxLineGap=max_line_gap)
    line_img = np.zeros((img.shape[0], img.shape[1], 3), dtype=np.uint8)
    draw_lines(line_img, lines)
    return line_img

# Python 3 has support for cool math symbols.

def weighted_img(img, initial_img, α=0.8, β=1., γ=0.):
    """
    `img` is the output of the hough_lines(), An image with lines drawn on it.
    Should be a blank image (all black) with lines drawn on it.
    
    `initial_img` should be the image before any processing.
    
    The result image is computed as follows:
    
    initial_img * α + img * β + γ
    NOTE: initial_img and img must be the same shape!
    """
    return cv2.addWeighted(initial_img, α, img, β, γ)

def pipeline(ori_image, options = None):
    image = ori_image.copy()

    if options is not None and not options: return image
    image = grayscale(image)

    if options and not set(options) >= {'gauss'}: return image
    image = gaussian_blur(image, options.get('gauss'))

    if options and not set(options) >= {'canny_low', 'canny_high'}: return image
    image = canny(image, options.get('canny_low'), options.get('canny_high'))

    if options and not set(options) >= {'region_height_pct', 'region_width_pct'}: return image
    (h, w) = image.shape
    hv = (100 - options.get('region_height_pct')) / 100
    wl = (100 - options.get('region_width_pct')) / 100 / 2
    wr = 0.5 + (options.get('region_width_pct') / 100 / 2)
    vertices = np.array([[(0,h),(w*wl, h*hv), (w*wr, h*hv), (w,h)]], dtype=np.int32)
    image = region_of_interest(image, vertices)

    if options and not set(options) >= {'hough_rho', 'hough_theta', 'hough_threshold', 'hough_min_len', 'hough_max_gap'}: return image
    image = hough_lines(image, options.get('hough_rho'), options.get('hough_theta') * np.pi/180, options.get('hough_threshold'), options.get('hough_min_len'), options.get('hough_max_gap'))

    if options and not set(options) >= {'result'}: return image
    image = weighted_img(image, ori_image, .4, 1., 10)
    return image

def get_params():
    options = {}

    try:
        opts, args = getopt.getopt(sys.argv[1:], 'yzi:g:l:h:v:w:r:t:d:n:x:')
    except getopt.GetoptError:
        print('lane.py -[yziglhvwrtdnx]')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-y':
            options['gray'] = True
        elif opt == '-z':
            options['result'] = True
        elif opt == '-i':
            options['image'] = int(arg)
        elif opt == '-g':
            options['gauss'] = int(arg)
        elif opt == '-l':
            options['canny_low'] = int(arg)
        elif opt == '-h':
            options['canny_high'] = int(arg)
        elif opt == '-v':
            options['region_height_pct'] = int(arg)
        elif opt == '-w':
            options['region_width_pct'] = int(arg)
        elif opt == '-r':
            options['hough_rho'] = int(arg)
        elif opt == '-t':
            options['hough_theta'] = int(arg)
        elif opt == '-d':
            options['hough_threshold'] = int(arg)
        elif opt == '-n':
            options['hough_min_len'] = int(arg)
        elif opt == '-x':
            options['hough_max_gap'] = int(arg)
    return options


default_options = {
    "gauss": 5,              #g
    "canny_low": 50,         #l
    "canny_high": 150,       #h
    "region_height_pct": 50, #v
    "region_width_pct": 20,  #w
    "hough_rho": 3,          #r  The resolution of the parameter r in pixels
    "hough_theta": 2,        #t  The resolution of the parameter θ in radians. 1 degree = CV_PI/180 radians
    "hough_threshold": 36,   #d  The minimum number of intersections to "*detect*" a line
    "hough_min_len": 34,     #n  The minimum number of points that can form a line. Lines with less than this number of points are disregarded.
    "hough_max_gap": 82      #x  The maximum gap between two points to be considered in the same line.
}

image_files = [
    'solidWhiteCurve.jpg',
    'solidWhiteRight.jpg',
    'solidYellowCurve.jpg',
    'solidYellowCurve2.jpg',
    'solidYellowLeft.jpg',
    'whiteCarLaneSwitch.jpg'
]

options = get_params()
img_idx = options.get('image')
options.pop('image', None)
image = mpimg.imread('test_images/' + image_files[img_idx])
image = pipeline(image, options)

plt.imshow(image, cmap='gray')
plt.axis('off')
#print('This image is: ', type(image), 'with dimensions:', image.shape)
plt.savefig(sys.stdout.buffer, format='png', bbox_inches='tight', pad_inches=0)
