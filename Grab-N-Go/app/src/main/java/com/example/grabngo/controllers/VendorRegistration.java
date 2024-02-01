package com.example.grabngo.controllers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;

import com.example.grabngo.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;

/** Function: For users to register as a Vendor
 *  Input: None (setContentView to layout/activity_vendor_registration.xml)
 *  Output: None
 *  Sent/Read from DB: FirebaseAuthentication (FAuth)
 *  Prev Page Link: ChooseOne.java
 *  Next Page Link: Vendorlogin.java
 *  Java Concepts/OOP: Intent
 */

public class VendorRegistration extends AppCompatActivity {

    TextInputLayout Fname, Lname, Email, Pass, cfpass; //stallname;
    Button signup, Emaill;
    FirebaseAuth FAuth;
    DatabaseReference databaseReference;
    FirebaseDatabase firebaseDatabase;
    String fname;
    String lname;
    String emailid;
    String password;
    String confirmpassword;
//    String Sname;
    String role = "Vendor";

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vendor_registration);

        Fname = (TextInputLayout) findViewById(R.id.Firstname);
        Lname = (TextInputLayout) findViewById(R.id.Lastname);
        Email = (TextInputLayout) findViewById(R.id.Email);
        Pass = (TextInputLayout) findViewById(R.id.Pwd);
        cfpass = (TextInputLayout) findViewById(R.id.Cpass);
//        stallname = (TextInputLayout) findViewById(R.id.Stallname);

        signup = (Button) findViewById(R.id.registervendorbtn);
        Emaill = (Button) findViewById(R.id.signinemailvendorbtn);

        databaseReference = firebaseDatabase.getInstance().getReference("Vendor");
        FAuth = FirebaseAuth.getInstance();


        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                fname = Fname.getEditText().getText().toString().trim();
                lname = Lname.getEditText().getText().toString().trim();
                emailid = Email.getEditText().getText().toString().trim();
                password = Pass.getEditText().getText().toString().trim();
                confirmpassword = cfpass.getEditText().getText().toString().trim();
//                Sname = stallname.getEditText().getText().toString().trim();


                if (isValid()) {

                    final ProgressDialog mDialog = new ProgressDialog(VendorRegistration.this);
                    mDialog.setCancelable(false);
                    mDialog.setCanceledOnTouchOutside(false);
                    mDialog.setMessage("Registering please wait...");
                    mDialog.show();

                    FAuth.createUserWithEmailAndPassword(emailid, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if (task.isSuccessful()) {
                                String useridd = FirebaseAuth.getInstance().getCurrentUser().getUid();
                                databaseReference = FirebaseDatabase.getInstance().getReference("User").child(useridd);
                                final HashMap<String,String> hashMap = new HashMap<>();
                                hashMap.put("Role", role);
                                databaseReference.setValue(hashMap).addOnCompleteListener(new OnCompleteListener<Void>() {

                                    @Override
                                    public void onComplete(@NonNull Task<Void> task) {
                                        HashMap<String, String> hashMappp = new HashMap<>();
                                        hashMappp.put("ConfirmPassword", confirmpassword);
                                        hashMappp.put("EmailID", emailid);
                                        hashMappp.put("Fname", fname);
                                        hashMappp.put("Lname", lname);
//                                        hashMappp.put("Lname", Sname);
                                        hashMappp.put("Password", password);

                                        firebaseDatabase.getInstance().getReference("Vendor")
                                                .child(FirebaseAuth.getInstance().getCurrentUser().getUid())
                                                .setValue(hashMappp).addOnCompleteListener(new OnCompleteListener<Void>() {

                                                    @Override
                                                    public void onComplete(@NonNull Task<Void> task) {
                                                        mDialog.dismiss();

                                                        FAuth.getCurrentUser().sendEmailVerification().addOnCompleteListener(new OnCompleteListener<Void>() {
                                                            @Override
                                                            public void onComplete(@NonNull Task<Void> task) {
                                                                if (task.isSuccessful()) {
                                                                    AlertDialog.Builder builder = new AlertDialog.Builder(VendorRegistration.this);
                                                                    builder.setMessage("Registered Successfully,Please Verify your Email");
                                                                    builder.setCancelable(false);
                                                                    builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                                                        @Override
                                                                        public void onClick(DialogInterface dialog, int which) {

                                                                            dialog.dismiss();
                                                                            startActivity(new Intent(VendorRegistration.this, Vendorlogin.class));

                                                                        }
                                                                    });
                                                                    AlertDialog alert = builder.create();
                                                                    alert.show();

                                                                } else {
                                                                    mDialog.dismiss();
                                                                    ReusableCodeForAll.ShowAlert(VendorRegistration.this, "Error", task.getException().getMessage());

                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                    }
                                });


                            } else {
                                mDialog.dismiss();
                                ReusableCodeForAll.ShowAlert(VendorRegistration.this, "Error", task.getException().getMessage());
                            }

                        }
                    });

                }

            }

        });

        Emaill.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent i = new Intent(VendorRegistration.this, Vendorlogin.class);
                startActivity(i);
                finish();
            }
        });


    }

    String emailpattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";

    public boolean isValid() {
        Email.setErrorEnabled(false);
        Email.setError("");
        Fname.setErrorEnabled(false);
        Fname.setError("");
        Lname.setErrorEnabled(false);
        Lname.setError("");
        Pass.setErrorEnabled(false);
        Pass.setError("");
        cfpass.setErrorEnabled(false);
        cfpass.setError("");
//        stallname.setErrorEnabled(false);
//        stallname.setError("");


        boolean isValidname = false, isValidemail = false, isvalidpassword = false, isvalidconfirmpassword = false, isvalid = false, isvalidlname = false;// isValidstallname = false;
        if (TextUtils.isEmpty(fname)) {
            Fname.setErrorEnabled(true);
            Fname.setError("Firstname is required");
        } else {
            isValidname = true;
        }
        if (TextUtils.isEmpty(lname)) {
            Lname.setErrorEnabled(true);
            Lname.setError("Lastname is required");
        } else {
            isvalidlname = true;
        }
//        if (TextUtils.isEmpty(Sname)) {
//            stallname.setErrorEnabled(true);
//            stallname.setError("Stall name is required");
//        } else {
//            isValidstallname = true;
//        }
        if (TextUtils.isEmpty(emailid)) {
            Email.setErrorEnabled(true);
            Email.setError("Email is required");
        } else {
            if (emailid.matches(emailpattern)) {
                isValidemail = true;
            } else {
                Email.setErrorEnabled(true);
                Email.setError("Enter a valid Email Address");
            }

        }
        if (TextUtils.isEmpty(password)) {
            Pass.setErrorEnabled(true);
            Pass.setError("Password is required");
        } else {
            if (password.length() < 6) {
                Pass.setErrorEnabled(true);
                Pass.setError("password too weak");
            } else {
                isvalidpassword = true;
            }
        }
        if (TextUtils.isEmpty(confirmpassword)) {
            cfpass.setErrorEnabled(true);
            cfpass.setError("Confirm Password is required");
        } else {
            if (!password.equals(confirmpassword)) {
                Pass.setErrorEnabled(true);
                Pass.setError("Password doesn't match");
            } else {
                isvalidconfirmpassword = true;
            }
        }


        isvalid = (isValidname && isvalidlname && isValidemail && isvalidconfirmpassword && isvalidpassword) ? true : false;  //&& isValidstallname
        return isvalid;
    }


}