from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..models import Booking
from ..extensions import db


booking_bp = Blueprint('bookings', __name__)


@booking_bp.route('', methods=['GET'])
@jwt_required()
def get_bookings():
    bookings = Booking.query.all()
    return jsonify([
    {
    'id': b.id,
    'title': b.title,
    'start': b.start.isoformat(),
    'end': b.end.isoformat(),
    'created_by': b.created_by
    } for b in bookings
    ])




@booking_bp.route('', methods=['POST'])
@jwt_required()
def create_booking():
    user = get_jwt_identity()
    data = request.json


    start = datetime.fromisoformat(data['start'])
    end = datetime.fromisoformat(data['end'])


    conflict = Booking.query.filter(
    Booking.start < end,
    Booking.end > start
    ).first()


    if conflict:
        return jsonify({'msg': 'Booking conflict'}), 409


    booking = Booking(
    title=data['title'],
    start=start,
    end=end,
    created_by=user
    )


    db.session.add(booking)
    db.session.commit()


    return jsonify({'msg': 'Booking created'})



@booking_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_booking(id):
    user = get_jwt_identity()
    booking = Booking.query.get_or_404(id)


    if booking.created_by != user:
        return jsonify({'msg': 'Forbidden'}), 403


    db.session.delete(booking)
    db.session.commit()


    return jsonify({'msg': 'Booking deleted'})