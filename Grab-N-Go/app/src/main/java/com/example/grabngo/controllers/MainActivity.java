package com.example.grabngo.controllers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;

import com.example.grabngo.R;

/** Function: For starting up and loading of application
 *  Input: None (setContentView to layout/activity_main.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: None (Already at beginning of app)
 *  Next Page Link: MainMenu.java
 *  Java Concepts/OOP: Intent
 */

public class MainActivity extends AppCompatActivity {

    ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        imageView = (ImageView) findViewById(R.id.imageview);

        imageView.animate().alpha(1f).setDuration(1000);

        new Handler().postDelayed(new Runnable() {

            @Override
            public void run() {

                Intent intent = new Intent(MainActivity.this, MainMenu.class);
                startActivity(intent);
                finish();

            }
        }, 3000);


    }

}
