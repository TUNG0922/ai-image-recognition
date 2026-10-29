
from transformers import pipeline
from PIL import Image

classifier = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224"
)

# Replace this with your own image path
image = Image.open("dogg.jpg").convert("RGB")

print("Input type:", type(image))
print("Input size:", image.size)

results = classifier(image, top_k=5)

print("Output type:", type(results))
print("Output:", results)

for result in results:
    print("Label:", result["label"])
    print("Score:", result["score"])
