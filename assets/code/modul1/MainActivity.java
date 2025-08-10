package com.example.helloworldapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private TextView titleTextView;
    private TextView messageTextView;
    private Button actionButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        titleTextView = findViewById(R.id.titleTextView);
        messageTextView = findViewById(R.id.messageTextView);
        actionButton = findViewById(R.id.actionButton);

        // Set button click listener
        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Show toast message when button is clicked
                Toast.makeText(MainActivity.this, 
                    "Hello from Android!", 
                    Toast.LENGTH_SHORT).show();
                
                // Update the title text
                titleTextView.setText("Welcome to Android!");
            }
        });
    }
}
