// English strings — the single source of truth for all UI copy.
//
// Keys use a "namespace.name" convention purely for readability — they are
// looked up directly as flat object keys (no nested traversal needed), so
// adding a new string is just adding one line here.
//
// Variables: a value can contain {{placeholders}} which LanguageContext's
// t(key, vars) will substitute, e.g. t('track.notFoundDesc', { id: orderId }).
//
// Other languages (e.g. src/i18n/si.js) are GENERATED from this file by
// scripts/translate-i18n.mjs — run `npm run i18n:translate` after editing here.
//
// IMPORTANT: prices, order IDs, emails, URLs and the "Bakeriya" brand name are
// intentionally left untranslated everywhere they appear in components.

export const en = {
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
  'track.subtitle': 'Enter your Order ID. Sign in to look up all your orders by email.',
  'track.placeholder': 'ORD-XXXXXXXX',
  'track.signInForEmail': 'Searching by email requires an account. Please sign in, or enter your Order ID.',
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
}
