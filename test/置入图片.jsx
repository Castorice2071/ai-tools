// 设置图片的 URL
var imageUrl = "D:\\Program Files\\Adobe Illustrator CS6\\Embroidered\\1-1-1.png"; // 替换为实际的图片 URL

var doc = app.activeDocument;

// 置入图片
var placedImage = doc.placedItems.add();
placedImage.file = File(imageUrl);

placedImage.position = [0, 0];
// 嵌入图片
placedImage.embed();
