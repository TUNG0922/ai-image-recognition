
from transformers import pipeline

print("Loading AI image classification model...")

classifier = pipeline(
    task="image-classification",
    model="google/vit-base-patch16-224"
)

print("AI image classification model loaded successfully!")


def classify_image(image):
    print("DEBUG: classify_image() was called!")

    results = classifier(image, top_k=5)

    predictions = []

    for rank, result in enumerate(results, start=1):
        predictions.append({
            "rank": rank,
            "label": result["label"],
            "confidence": round(float(result["score"]), 4)
        })

    print("DEBUG: predictions =", predictions)

    return predictions
