var cate = ['Phone and tablets', 'Home and Office', 'Gaming', 'AutoMobile', 'Electronics', 'Fashion' , 'Musical Instrument', 'Garden & outdoors', 'Books,Musics and movies', 'Baby products', 'Health & beauty', 'TOYS & GAMES', 'Grocery', 'pet supplies'],
    subCate = [
        ['Mobile Phone Accessories', 'Mobile Phones', 'Phone & Fax', 'Tablet Accessories', 'Tablets', 'Telephones & Accessories'],

        ['Arts, Crafts & Sewing', 'Home & Kitchen', 'Home & Office Furniture', 'Large Appliances & Home Improvement', 'Office Products', 'Small & Cooking Appliances'], 

        ['Nintendo', 'Other Gaming Systems', 'PC Gaming', 'Playstation', 'Retro Gaming & Microconsoles', 'Sony PSP', 'Xbox'],

        ['Car Care', 'Car Electronics & Accessories', 'Exterior Accessories', 'Interior Accessories', 'Lights & Lighting Accessories', 'Motorcycle & Powersports', 'Oils & Fluids', 'Paint & Paint Supplies', 'Power & Battery', 'Replacement Parts', 'Tools & Equipment', 'Tyre & Rim'],

        ['Accessories & Supplies', 'Camera & Photo', 'Cameras', 'Car & Vehicle Electronics', 'eBook Readers & Accessories', 'Electronic Gadgets', 'Headphones', 'Home Audio', 'Portable Audio & Recorders', 'Radios & Transceivers', 'Security & Surveillance', 'Television & Video', 'Wearable Technology'],

        ['Baby', 'Bulk Fashion Accessories', 'Costumes & Accessories', 'Fabrics', 'Kids Fashion', 'Luggage & Travel Gear', 'Mens Fashion', 'Multi-Pack', 'Shoe, Jewelry & Watch Accessories', 'Uniforms, Work & Safety', 'Watches', 'Weddings', 'Womens Fashion'],

        ['Amplifiers & Effects', 'Band & Orchestra', 'Bass Guitars', 'Drums & Percussion', 'Electronic Music, DJ & Karaoke', 'Guitars', 'Instrument Accessories', 'Keyboards & MIDI', 'Live Sound & Stage', 'Microphones & Accessories', 'Stringed Instruments', 'Studio Recording Equipment'],

        ['Farm & Ranch', 'Gardening & Lawn Care', 'Generators & Portable Power', 'Grills & Outdoor Cooking', 'Outdoor Décor', 'Outdoor Heating & Cooling', 'Outdoor Lighting', 'Outdoor Power Tools', 'Patio Furniture & Accessories', 'Pools, Hot Tubs & Supplies'],

        ['Art & Humanities', 'Bestselling Books', 'Biography & Autobiography', 'Business & Finance', 'DVDs', 'Education & Learning', 'Entertainment', 'Family & Lifestyle', 'Fiction', 'Journals & Planners', 'Magazines', 'Motivational & Self-Help', 'Religion', 'Science & Technology', 'Stationery'],

        ['Apparel & Accessories', 'Baby & Toddler Toys', 'Baby Stationery', 'Bathing & Skin Care', 'Car Seats & Accessories', 'Diapering', 'Feeding', 'Gear', 'Gifts', 'Health & Baby Care', 'Nursery', 'Potty Training', 'Pregnancy & Maternity', 'Safety', 'Strollers & Accessories'],

        ['Baby & Child Care', 'Beauty & Personal Care', 'Dermocosmetics', 'Fragrances', 'Health Care', 'Kids Beauty', 'Medical Supplies & Equipment', 'Mens Grooming', 'Oral Care', 'Personal Care', 'Sexual Wellness', 'Sports Nutrition', 'Vision Care', 'Vitamins & Dietary Supplements', 'Wellness & Relaxation'],

        ['Action Figures & Statues', 'Arts & Crafts', 'Baby & Toddler Toys', 'Building Toys', 'Dolls & Accessories', 'Dress Up & Pretend Play', 'Games', 'Kids Electronics', 'Kids Furniture, Décor & Storage', 'Learning & Education', 'Novelty & Gag Toys', 'Party Supplies', 'Puzzles', 'Sports & Outdoor Play', 'Stuffed Animals & Plush Toys', 'Toy Remote Control & Play Vehicles', 'Tricycles, Scooters & Wagons'],

        ['Air Fresheners', 'Baby Food', 'Beer, Wine & Spirits', 'Beverages', 'Breakfast Foods', 'Candy & Chocolate', 'Canned, Jarred & Packaged Foods', 'Condiments & Salad Dressings', 'Cooking & Baking', 'Dairy, Cheese & Eggs', 'Deli', 'Dishwashing', 'Dried Beans, Grains & Rice', 'Drinks', 'Food Cupboard', 'Gift Items, Hamper Gifts & Party Supplies', 'Herbs, Spices & Seasonings', 'Household Batteries', 'Household Cleaning', 'Household Supplies', 'Jams, Jellies & Sweet Spreads', 'Laundry', 'Lighters & Matches', 'Paper & Plastic', 'Tobacco-Related Products'],
        ['Birds', 'Cats', 'Dogs', 'Fish & Aquatic Pets', 'Small Animals'],
    ];
    
var cateHtml = '';
for (i = 0; i < cate.length; i++) {
    cateHtml += '<div><h>' + cate[i] + '</h>';
    const mCateContId = 'phone-product-category-bzcx9r3r8sd22a5n'+i;
    var phoneCateHtml = '<div class="phone-product-cate-dialog-head-cont"  id="'+mCateContId+'"><b>'+ cate[i] + '</b><div>';
    var index = 0;
    while (index <= subCate[i].length - 1) {
        cateHtml += '<a href="productsearch.html?subCategory='+subCate[i][index]+'">' + subCate[i][index] + '</a>';
        phoneCateHtml += '<a href="productsearch.html?category='+subCate[i][index]+'">' + subCate[i][index] + '</a>';
        ++index;
    }
    cateHtml += '</div>';
    phoneCateHtml += '</div></div>';
    $('.phone-product-cate-dialog-scroll').append(phoneCateHtml);
    $('#'+mCateContId+' b').click(function(){
        $('#'+mCateContId+' div').slideToggle(700);
    });

}
$('.product-cate-drop-wide').html(cateHtml);
$('.product-cate-drop-wide-sec').html(cateHtml);

$('.phone-product-cate-dialog-loading').hide();