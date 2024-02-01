package com.example.grabngo.controllers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.example.grabngo.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;

/** Function: For users to register as a Customer
 *  Input: None (setContentView to layout/activity_customer_registration.xml)
 *  Output: None
 *  Sent/Read from DB: FirebaseAuthentication (FAuth)
 *  Prev Page Link: ChooseOne.java
 *  Next Page Link: Customerlogin.java
 *  Java Concepts/OOP: Intent
 */

public class CustomerRegistration extends AppCompatActivity {

    TextInputLayout fname, lname,emaill, pass, cmpass;
    Button Registercustbtn, EmailSignup;
    FirebaseAuth FAuth;
    DatabaseReference databaseReference;
    FirebaseDatabase firebaseDatabase;
    String email;
    String firstname;
    String lastname;
    String password;
    String confirmpass;
    String role = "Customer";
    ProgressDialog mDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_customer_registration);

        try {
            mDialog = new ProgressDialog(CustomerRegistration.this);
            mDialog.setMessage("Registering please wait...");
            mDialog.setCancelable(false);
            mDialog.setCanceledOnTouchOutside(false);
            fname = (TextInputLayout) findViewById(R.id.Fname);
            lname = (TextInputLayout) findViewById(R.id.Lname);
            emaill = (TextInputLayout) findViewById(R.id.Emailid);
            pass = (TextInputLayout) findViewById(R.id.Password);
            cmpass = (TextInputLayout) findViewById(R.id.confirmpass);
            Registercustbtn = (Button) findViewById(R.id.customersignupbtn);
            EmailSignup = (Button) findViewById(R.id.customeremailsigninbtn);


            databaseReference = firebaseDatabase.getInstance().getReference("Customer");
            FAuth = FirebaseAuth.getInstance();

            Registercustbtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    email = emaill.getEditText().getText().toString().trim();
                    password = pass.getEditText().getText().toString().trim();
                    firstname = fname.getEditText().getText().toString().trim();
                    lastname = lname.getEditText().getText().toString().trim();
                    confirmpass = cmpass.getEditText().getText().toString().trim();


                    if (isValid()) {

                        mDialog.show();

                        FAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    String userid = FirebaseAuth.getInstance().getCurrentUser().getUid();
                                    databaseReference = FirebaseDatabase.getInstance().getReference("User").child(userid);
                                    final HashMap<String, String> hashMap = new HashMap<>();
                                    hashMap.put("Role", role);
                                    databaseReference.setValue(hashMap).addOnCompleteListener(new OnCompleteListener<Void>() {
                                        @Override
                                        public void onComplete(@NonNull Task<Void> task) {
                                            HashMap<String, String> hashMappp = new HashMap<>();
                                            hashMappp.put("ConfirmPassword", confirmpass);
                                            hashMappp.put("EmailID", email);
                                            hashMappp.put("FirstName", firstname);
                                            hashMappp.put("LastName", lastname);
                                            hashMappp.put("Password", password);

                                            firebaseDatabase.getInstance().getReference("Customer")
                                                    .child(FirebaseAuth.getInstance().getCurrentUser().getUid())
                                                    .setValue(hashMappp).addOnCompleteListener(new OnCompleteListener<Void>() {

                                                        @Override
                                                        public void onComplete(@NonNull Task<Void> task) {
                                                            FAuth.getCurrentUser().sendEmailVerification().addOnCompleteListener(new OnCompleteListener<Void>() {

                                                                @Override
                                                                public void onComplete(@NonNull Task<Void> task) {
                                                                    if (task.isSuccessful()) {
                                                                        mDialog.dismiss();
                                                                        AlertDialog.Builder builder = new AlertDialog.Builder(CustomerRegistration.this);
                                                                        builder.setMessage("Registered Successfully,Please Verify your Email");
                                                                        builder.setCancelable(false);
                                                                        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                                                            @Override
                                                                            public void onClick(DialogInterface dialog, int which) {

                                                                                dialog.dismiss();
                                                                                startActivity(new Intent(CustomerRegistration.this, Customerlogin.class));


                                                                            }
                                                                        });
                                                                        AlertDialog alert = builder.create();
                                                                        alert.show();

                                                                    } else {
                                                                        mDialog.dismiss();
                                                                        ReusableCodeForAll.ShowAlert(CustomerRegistration.this,"Error",task.getException().getMessage());

                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                        }
                                    });

                                } else {
                                    mDialog.dismiss();
                                    ReusableCodeForAll.ShowAlert(CustomerRegistration.this,"Error",task.getException().getMessage());
                                }
                            }
                        });
                    }


                }
            });
        } catch (Exception e) {
            mDialog.dismiss();
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_SHORT).show();
        }


        EmailSignup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent i = new Intent(CustomerRegistration.this, Customerlogin.class);
                startActivity(i);
                finish();
            }
        });


    }

    String emailpattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";

    public boolean isValid() {
        emaill.setErrorEnabled(false);
        emaill.setError("");
        fname.setErrorEnabled(false);
        fname.setError("");
        lname.setErrorEnabled(false);
        lname.setError("");
        pass.setErrorEnabled(false);
        pass.setError("");
        cmpass.setErrorEnabled(false);
        cmpass.setError("");


        boolean isValidfirstname = false, isValidlastname = false, isValidemail = false, isvalidpassword = false, isvalidconfirmpassword = false, isvalid = false;
        if (TextUtils.isEmpty(firstname)) {
            fname.setErrorEnabled(true);
            fname.setError("FirstName is required");
        } else {
            isValidfirstname = true;
        }
        if (TextUtils.isEmpty(lastname)) {
            lname.setErrorEnabled(true);
            lname.setError("LastName is required");
        } else {
            isValidlastname = true;
        }
        if (TextUtils.isEmpty(email)) {
            emaill.setErrorEnabled(true);
            emaill.setError("Email is required");
        } else {
            if (email.matches(emailpattern)) {
                isValidemail = true;
            } else {
                emaill.setErrorEnabled(true);
                emaill.setError("Enter a valid Email Address");
            }

        }

        if (TextUtils.isEmpty(password)) {
            pass.setErrorEnabled(true);
            pass.setError("Password is required");
        } else {
            if (password.length() < 6) {
                pass.setErrorEnabled(true);
                pass.setError("Password too weak");
                cmpass.setError("password too weak");
            } else {
                isvalidpassword = true;
            }
        }
        if (TextUtils.isEmpty(confirmpass)) {
            cmpass.setErrorEnabled(true);
            cmpass.setError("Confirm Password is required");
        } else {
            if (!password.equals(confirmpass)) {
                pass.setErrorEnabled(true);
                pass.setError("Password doesn't match");
                cmpass.setError("Password doesn't match");
            } else {
                isvalidconfirmpassword = true;
            }
        }
        isvalid = (isValidfirstname && isValidlastname && isValidemail && isvalidconfirmpassword && isvalidpassword) ? true : false;
        return isvalid;
    }
}