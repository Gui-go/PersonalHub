import tensorflow as tf
import numpy as np

# Create a simple linear regression model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(units=1, input_shape=[1])
])

# Compile the model
model.compile(optimizer='sgd', loss='mean_squared_error')

# Generate dummy data for training
xs = np.array([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], dtype=float)
ys = np.array([-3.0, -1.0, 1.0, 3.0, 5.0, 7.0], dtype=float)

# Train the model
model.fit(xs, ys, epochs=500, verbose=0)

# Save the model in SavedModel format
model.export('simple_model')



# Test the model
test_input = np.array([[2.0]], dtype=float)
prediction = model.predict(test_input)
print(f"Prediction for input 2.0: {prediction[0][0]}")