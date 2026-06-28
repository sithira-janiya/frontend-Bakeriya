// Flat key -> string translation maps for English (en) and Sinhala (si).
//
// Keys use a "namespace.name" convention purely for readability — they are
// looked up directly as flat object keys (no nested traversal needed), so
// adding a new string is just adding one line to each language block below.
//
// Variables: a value can contain {{placeholders}} which LanguageContext's
// t(key, vars) will substitute, e.g. t('track.notFoundDesc', { id: orderId }).
//
// IMPORTANT: prices, order IDs, emails, URLs and the "Bakeriya" brand name are
// intentionally left untranslated everywhere they appear in components.

export const translations = {
  en: {
    // Brand (shown in Navbar + LoadingScreen + Footer)
    'brand.name': 'Bakeriya',

    // Navbar
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.trackOrder': 'Track Order',
    'nav.cart': 'Cart',
    'nav.chefPanel': 'Chef Panel',
    'nav.toggleMenu': 'Toggle menu',

    // Home page
    'home.badge': 'Fresh from the oven',
    'home.heroTitlePrefix': 'Baked fresh,',
    'home.heroTitleHighlight': 'made for you',
    'home.heroDesc':
      'Order your favorite breads, cakes and pastries online, then watch your order go from oven to ready in real time.',
    'home.viewMenu': 'View Menu',
    'home.trackAnOrder': 'Track an Order',
    'home.bestsellers': 'Bestsellers',
    'home.seeFullMenu': 'See full menu',
    'home.howItWorks': 'How It Works',
    'home.step': 'STEP',
    'home.step1Title': 'Browse the Menu',
    'home.step1Desc': 'Pick from fresh breads, cakes, pastries, cookies and more.',
    'home.step2Title': 'Chef Starts Baking',
    'home.step2Desc': 'Your order goes straight to our chef and cooking begins.',
    'home.step3Title': 'Get Notified',
    'home.step3Desc': 'Track your order live — pending, cooking, then ready.',
    'home.step4Title': 'Collect & Enjoy',
    'home.step4Desc': 'Swing by the counter and pick up your fresh order.',
    'home.areYouChef': 'Are you the chef?',
    'home.chefCta': 'Head to the Chef Panel to see incoming orders and update their status live.',
    'home.openChefPanel': 'Open Chef Panel',

    // Menu page
    'menu.title': 'Available Items',
    'menu.subtitle': 'Browse and filter our fresh bakes — add what you like to your order.',
    'menu.noItems': 'No items match your filters.',
    'menu.loading': 'Loading fresh bakes…',
    'menu.itemSingular': 'item',
    'menu.itemPlural': 'items',
    'menu.proceedToOrder': 'Proceed to Order',

    // Filters
    'filter.searchPlaceholder': 'Search items...',
    'filter.filtersLabel': 'Filters:',
    'filter.sortFeatured': 'Sort: Featured',
    'filter.sortPriceAsc': 'Price: Low to High',
    'filter.sortPriceDesc': 'Price: High to Low',
    'filter.sortNameAsc': 'Name: A–Z',

    // Categories
    'categories.All': 'All',
    'categories.Breads': 'Breads',
    'categories.Cakes': 'Cakes',
    'categories.Pastries': 'Pastries',
    'categories.Cookies': 'Cookies',
    'categories.Beverages': 'Beverages',

    // Tags
    'tags.veg': 'veg',
    'tags.gluten-free': 'gluten-free',
    'tags.bestseller': 'bestseller',
    'tags.eggless': 'eggless',
    'tags.vegan': 'vegan',

    // Item card
    'item.add': 'Add',
    'item.added': 'Added',
    'item.soldOut': 'Sold out',
    'item.unavailable': 'Currently unavailable',
    'item.decreaseQty': 'Decrease quantity',
    'item.increaseQty': 'Increase quantity',

    // Order / cart / checkout
    'order.yourOrder': 'Your Order',
    'order.total': 'Total',
    'order.yourDetails': 'Your Details',
    'order.fullName': 'Full Name',
    'order.addressLabel': 'Delivery / Pickup Address',
    'order.email': 'Email',
    'order.phone': 'Phone Number',
    'order.placeOrder': 'Place Order',
    'order.submitFailed': 'Could not place your order. Please try again.',
    'order.cartEmptyTitle': 'Your cart is empty',
    'order.cartEmptyDesc': 'Add some fresh bakes from the menu before placing an order.',
    'order.browseMenu': 'Browse Menu',
    'order.sendingToKitchen': 'Sending your order to the kitchen',
    'order.successTitle': 'Order placed!',
    'order.successDesc': 'Thank you! Your fresh bakes are now with our kitchen.',
    'order.orderNumber': 'Order number',
    'order.eta': 'Estimated ready in',
    'order.etaValue': '25–35 min',
    'order.trackNow': 'Track Order',
    'order.continueShopping': 'Continue Shopping',
    'order.redirecting': 'Taking you to live tracking…',
    'app.preheating': 'Preheating the ovens',

    // Form validation errors
    'errors.nameRequired': 'Name is required',
    'errors.addressRequired': 'Address is required',
    'errors.emailRequired': 'Email is required',
    'errors.emailInvalid': 'Enter a valid email',
    'errors.phoneRequired': 'Phone number is required',
    'errors.phoneInvalid': 'Enter a valid phone number',

    // Track order page
    'track.title': 'Track Your Order',
    'track.subtitle': 'Enter your Order ID or the email you used when ordering.',
    'track.placeholder': 'ORD-XXXXX or you@email.com',
    'track.find': 'Find',
    'track.searching': 'Searching…',
    'track.loading': 'Loading your order…',
    'track.errorTitle': 'Something went wrong',
    'track.errorDesc': 'We could not load this order right now. Please try again.',
    'track.notFoundSearch': 'No order found. Check your Order ID or email.',
    'track.orderNotFoundTitle': 'Order not found',
    'track.orderNotFoundDesc': "We couldn't find an order with ID {{id}}.",
    'track.tryAnotherLookup': 'Try Another Lookup',
    'track.order': 'Order',
    'track.liveUpdateNote': 'This page updates live — no need to refresh.',
    'track.items': 'Items',
    'track.pickupDetails': 'Pickup Details',
    'track.name': 'Name:',
    'track.address': 'Address:',
    'track.email': 'Email:',
    'track.phone': 'Phone:',
    'track.placed': 'Placed',
    'track.trackAnother': 'Track a different order',

    // Order status labels + messages
    'status.pending': 'Order Placed',
    'status.cooking': 'Preparing',
    'status.ready': 'Ready for Pickup',
    'status.completed': 'Collected',
    'statusMsg.pending': "We've received your order and it's queued for the chef.",
    'statusMsg.cooking': 'Our chef is baking your order right now!',
    'statusMsg.ready': 'Your order is ready — come collect it!',
    'statusMsg.completed': 'Order collected. Enjoy!',

    // Chef panel
    'chef.panelTitle': 'Chef Panel',
    'chef.enterPinDesc': 'Enter the staff password to view and manage incoming orders.',
    'chef.pinPlaceholder': 'Staff password',
    'chef.enterPanel': 'Enter Panel',
    'chef.signingIn': 'Signing in…',
    'chef.incorrectPin': 'Incorrect password. Try again.',
    'chef.demoPin': 'Demo PIN: 1234',
    'chef.liveQueueDesc': 'Live order queue — updates push to customers instantly.',
    'chef.logout': 'Logout',
    'chef.noOrdersHere': 'No orders here.',
    'chef.total': 'Total',
    'chef.startCooking': 'Start Cooking',
    'chef.markReady': 'Mark Ready',
    'chef.markCollected': 'Mark Collected',

    // Footer
    'footer.tagline': 'Fresh baked goods, made to order, ready when you are.',
    'footer.hours': 'Hours',
    'footer.weekdayHours': 'Mon–Sat: 7:00 AM – 7:00 PM',
    'footer.sundayHours': 'Sunday: 8:00 AM – 2:00 PM',
    'footer.visitUs': 'Visit Us',
    'footer.rights': 'All rights reserved',

    // 404
    'notFound.title': 'Page not found',
    'notFound.desc': "That page got eaten. Let's get you back to something fresh.",
    'notFound.backHome': 'Back to Home',

    // Language selector
    'lang.english': 'English',
    'lang.sinhala': 'සිංහල'
  },

  si: {
    // Brand (shown in Navbar + LoadingScreen + Footer)
    'brand.name': 'බේකරිය',

    // Navbar
    'nav.home': 'මුල් පිටුව',
    'nav.menu': 'මෙනුව',
    'nav.trackOrder': 'ඇණවුම පරීක්ෂා කරන්න',
    'nav.cart': 'කරත්තය',
    'nav.chefPanel': 'චෙෆ් පැනලය',
    'nav.toggleMenu': 'මෙනුව විවෘත/වසන්න',

    // Home page
    'home.badge': 'උඳුනෙන් අලුතින්ම',
    'home.heroTitlePrefix': 'අලුතින්ම පිළිස්සූ,',
    'home.heroTitleHighlight': 'ඔබ වෙනුවෙන්ම',
    'home.heroDesc':
      'ඔබ කැමති පාන්, කේක් සහ පේස්ට්‍රි අන්තර්ජාලයෙන් ඇණවුම් කර, ඔබගේ ඇණවුම සූදානම් වන තෙක් සජීවීව පරීක්ෂා කරන්න.',
    'home.viewMenu': 'මෙනුව බලන්න',
    'home.trackAnOrder': 'ඇණවුම පරීක්ෂා කරන්න',
    'home.bestsellers': 'වැඩිම අලෙවි වන ආහාර',
    'home.seeFullMenu': 'සම්පූර්ණ මෙනුව බලන්න',
    'home.howItWorks': 'මෙය ක්‍රියා කරන ආකාරය',
    'home.step': 'පියවර',
    'home.step1Title': 'මෙනුව බලන්න',
    'home.step1Desc': 'අලුත් පාන්, කේක්, පේස්ට්‍රි, කුකීස් සහ තවත් දේ අතරින් තෝරන්න.',
    'home.step2Title': 'චෙෆ් පිසීම ආරම්භ කරයි',
    'home.step2Desc': 'ඔබගේ ඇණවුම කෙලින්ම අපගේ චෙෆ් වෙත යයි, පිසීම ආරම්භ වේ.',
    'home.step3Title': 'දැනුම්දීම ලැබේ',
    'home.step3Desc': 'ඔබගේ ඇණවුම සජීවීව පරීක්ෂා කරන්න — සැකසෙමින්, පිසෙමින්, පසුව සූදානම්.',
    'home.step4Title': 'රැගෙන විඳින්න',
    'home.step4Desc': 'කවුන්ටරයට පැමිණ ඔබගේ අලුත් ඇණවුම රැගෙන යන්න.',
    'home.areYouChef': 'ඔබ චෙෆ්ද?',
    'home.chefCta': 'එන ඇණවුම් බැලීමට සහ ඒවායේ තත්ත්වය සජීවීව යාවත්කාලීන කිරීමට චෙෆ් පැනලයට යන්න.',
    'home.openChefPanel': 'චෙෆ් පැනලය විවෘත කරන්න',

    // Menu page
    'menu.title': 'ලබාගත හැකි ආහාර',
    'menu.subtitle': 'අපගේ අලුත් පිළිස්සූ ආහාර බලන්න, පෙරහන් කරන්න, ඔබ කැමති දේ ඇණවුමට එක් කරන්න.',
    'menu.noItems': 'ඔබගේ පෙරහන් වලට ගැලපෙන ආහාර නොමැත.',
    'menu.loading': 'අලුත් පිළිස්සූ ආහාර පූරණය වෙමින්…',
    'menu.itemSingular': 'ආහාරය',
    'menu.itemPlural': 'ආහාර',
    'menu.proceedToOrder': 'ඇණවුමට යන්න',

    // Filters
    'filter.searchPlaceholder': 'ආහාර සොයන්න...',
    'filter.filtersLabel': 'පෙරහන්:',
    'filter.sortFeatured': 'වර්ග කරන්න: විශේෂිත',
    'filter.sortPriceAsc': 'මිල: අඩුවේ සිට වැඩිවට',
    'filter.sortPriceDesc': 'මිල: වැඩිවේ සිට අඩුවට',
    'filter.sortNameAsc': 'නම: A–Z',

    // Categories
    'categories.All': 'සියල්ල',
    'categories.Breads': 'පාන් වර්ග',
    'categories.Cakes': 'කේක් වර්ග',
    'categories.Pastries': 'පේස්ට්‍රි',
    'categories.Cookies': 'කුකීස්',
    'categories.Beverages': 'පානයන්',

    // Tags
    'tags.veg': 'ශාක ආහාර',
    'tags.gluten-free': 'ග්ලූටන් රහිත',
    'tags.bestseller': 'වැඩිම අලෙවි',
    'tags.eggless': 'බිත්තර රහිත',
    'tags.vegan': 'වීගන්',

    // Item card
    'item.add': 'එක් කරන්න',
    'item.added': 'එක් කරන ලදී',
    'item.soldOut': 'විකිණී අවසන්',
    'item.unavailable': 'දැනට ලබාගත නොහැක',
    'item.decreaseQty': 'ප්‍රමාණය අඩු කරන්න',
    'item.increaseQty': 'ප්‍රමාණය වැඩි කරන්න',

    // Order / cart / checkout
    'order.yourOrder': 'ඔබගේ ඇණවුම',
    'order.total': 'එකතුව',
    'order.yourDetails': 'ඔබගේ විස්තර',
    'order.fullName': 'සම්පූර්ණ නම',
    'order.addressLabel': 'ලබාගැනීමේ / බෙහෙත් ලිපිනය',
    'order.email': 'විද්‍යුත් තැපෑල',
    'order.phone': 'දුරකථන අංකය',
    'order.placeOrder': 'ඇණවුම තබන්න',
    'order.submitFailed': 'ඔබගේ ඇණවුම තැබිය නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    'order.cartEmptyTitle': 'ඔබගේ කරත්තය හිස්ය',
    'order.cartEmptyDesc': 'ඇණවුමක් තැබීමට පෙර මෙනුවෙන් අලුත් ආහාර කරත්තයට එක් කරන්න.',
    'order.browseMenu': 'මෙනුව බලන්න',
    'order.sendingToKitchen': 'ඔබගේ ඇණවුම කුස්සියට යයි',
    'order.successTitle': 'ඇණවුම තැබුවා!',
    'order.successDesc': 'ස්තූතියි! ඔබගේ අලුත් ආහාර දැන් අපගේ කුස්සියට ලැබී ඇත.',
    'order.orderNumber': 'ඇණවුම් අංකය',
    'order.eta': 'ඇස්තමේන්තුගත සූදානම් වේලාව',
    'order.etaValue': 'මිනිත්තු 25–35',
    'order.trackNow': 'ඇණවුම පරීක්ෂා කරන්න',
    'order.continueShopping': 'සාප්පු සවාරිය දිගටම',
    'order.redirecting': 'සජීවී ලුහුබැඳීමට ඔබව ගෙන යමින්…',
    'app.preheating': 'උඳුන රත් කරමින්',

    // Form validation errors
    'errors.nameRequired': 'නම අවශ්‍යයි',
    'errors.addressRequired': 'ලිපිනය අවශ්‍යයි',
    'errors.emailRequired': 'විද්‍යුත් තැපෑල අවශ්‍යයි',
    'errors.emailInvalid': 'වැලිඩ් විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න',
    'errors.phoneRequired': 'දුරකථන අංකය අවශ්‍යයි',
    'errors.phoneInvalid': 'වැලිඩ් දුරකථන අංකයක් ඇතුළත් කරන්න',

    // Track order page
    'track.title': 'ඔබගේ ඇණවුම පරීක්ෂා කරන්න',
    'track.subtitle': 'ඔබගේ ඇණවුම් අංකය හෝ ඇණවුම් කිරීමේදී භාවිතා කළ ඊමේල් ලිපිනය ඇතුළත් කරන්න.',
    'track.placeholder': 'ORD-XXXXX හෝ you@email.com',
    'track.find': 'සොයන්න',
    'track.searching': 'සොයමින්…',
    'track.loading': 'ඔබගේ ඇණවුම පූරණය වෙමින්…',
    'track.errorTitle': 'යම් දෝෂයක් ඇතිවිය',
    'track.errorDesc': 'මේ මොහොතේ මෙම ඇණවුම පූරණය කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    'track.notFoundSearch': 'ඇණවුමක් හමු නොවුණි. ඔබගේ ඇණවුම් අංකය හෝ ඊමේල් පරීක්ෂා කරන්න.',
    'track.orderNotFoundTitle': 'ඇණවුම හමු නොවුණි',
    'track.orderNotFoundDesc': '{{id}} අංකය සහිත ඇණවුමක් අපට හමු නොවුණි.',
    'track.tryAnotherLookup': 'තවත් ඇණවුමක් සොයන්න',
    'track.order': 'ඇණවුම',
    'track.liveUpdateNote': 'මෙම පිටුව සජීවීව යාවත්කාලීන වේ — නැවත පූරණය කිරීම අවශ්‍ය නැත.',
    'track.items': 'ආහාර',
    'track.pickupDetails': 'රැගෙන යාමේ විස්තර',
    'track.name': 'නම:',
    'track.address': 'ලිපිනය:',
    'track.email': 'විද්‍යුත් තැපෑල:',
    'track.phone': 'දුරකථන:',
    'track.placed': 'තබන ලද්දේ',
    'track.trackAnother': 'වෙනත් ඇණවුමක් පරීක්ෂා කරන්න',

    // Order status labels + messages
    'status.pending': 'ඇණවුම තබන ලදී',
    'status.cooking': 'සකස් කරමින්',
    'status.ready': 'රැගෙන යාමට සූදානම්',
    'status.completed': 'රැගෙන ගියා',
    'statusMsg.pending': 'ඔබගේ ඇණවුම අප වෙත ලැබී ඇත, එය චෙෆ් වෙනුවෙන් පෙළගස්වා ඇත.',
    'statusMsg.cooking': 'අපගේ චෙෆ් දැන් ඔබගේ ඇණවුම පිසිමින් සිටී!',
    'statusMsg.ready': 'ඔබගේ ඇණවුම සූදානම් — රැගෙන යාමට පැමිණෙන්න!',
    'statusMsg.completed': 'ඇණවුම රැගෙන ගොස් ඇත. රසවිඳින්න!',

    // Chef panel
    'chef.panelTitle': 'චෙෆ් පැනලය',
    'chef.enterPinDesc': 'එන ඇණවුම් බැලීමට සහ කළමනාකරණය කිරීමට කාර්ය මණ්ඩල මුරපදය ඇතුළත් කරන්න.',
    'chef.pinPlaceholder': 'කාර්ය මණ්ඩල මුරපදය',
    'chef.enterPanel': 'පැනලයට ඇතුළු වන්න',
    'chef.signingIn': 'පිවිසෙමින්…',
    'chef.incorrectPin': 'වැරදි මුරපදයකි. නැවත උත්සාහ කරන්න.',
    'chef.demoPin': 'පරීක්ෂණ PIN: 1234',
    'chef.liveQueueDesc': 'සජීවී ඇණවුම් පෙළ — යාවත්කාලීන කිරීම් ක්ෂණිකව පාරිභෝගිකයින්ට යවනු ලැබේ.',
    'chef.logout': 'ඉවත් වන්න',
    'chef.noOrdersHere': 'මෙහි ඇණවුම් නැත.',
    'chef.total': 'එකතුව',
    'chef.startCooking': 'පිසීම ආරම්භ කරන්න',
    'chef.markReady': 'සූදානම් බව සටහන් කරන්න',
    'chef.markCollected': 'රැගෙන ගිය බව සටහන් කරන්න',

    // Footer
    'footer.tagline': 'ඔබට අවශ්‍ය වෙලාවට සූදානම් වන අලුත්ම පිළිස්සූ ආහාර.',
    'footer.hours': 'වේලාවන්',
    'footer.weekdayHours': 'සඳුදා–සෙනසුරාදා: පෙ.ව 7:00 – ප.ව 7:00',
    'footer.sundayHours': 'ඉරිදා: පෙ.ව 8:00 – ප.ව 2:00',
    'footer.visitUs': 'අපව හමුවන්න',
    'footer.rights': 'සියලු හිමිකම් ඇවිරිණි',

    // 404
    'notFound.title': 'පිටුව හමු නොවුණි',
    'notFound.desc': 'එම පිටුව නැතිවී ඇත. අපි ඔබව නැවත රසවත් දෙයක් වෙත ගෙන යමු.',
    'notFound.backHome': 'මුල් පිටුවට යන්න',

    // Language selector
    'lang.english': 'English',
    'lang.sinhala': 'සිංහල'
  }
}
